import {
  areaLabels as fallbackAreas,
  ageLabels as fallbackAges,
  createFallbackPlan,
  filterFallbackLibrary,
} from "../data/fallback.js";

const API_BASE =
  window.API_BASE_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

let metaAvailable = true;
let planAvailable = true;
let libraryAvailable = true;

const libraryCache = new Map();

export async function getMeta() {
  if (metaAvailable) {
    try {
      const response = await fetch(`${API_BASE}/api/meta`);
      if (!response.ok) {
        throw new Error(`Erro ${response.status}`);
      }

      const data = await response.json();
      return {
        areas: data?.areas ?? fallbackAreas,
        ages: data?.ages ?? fallbackAges,
        source: data ? "api" : "fallback",
      };
    } catch (error) {
      console.warn("Falha ao obter metadados da API. Usando fallback local.", error);
      metaAvailable = false;
    }
  }

  return {
    areas: fallbackAreas,
    ages: fallbackAges,
    source: "fallback",
  };
}

export async function createPlan(payload) {
  if (planAvailable) {
    try {
      const response = await fetch(`${API_BASE}/api/plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}`);
      }

      const data = await response.json();
      return { ...data, source: "api" };
    } catch (error) {
      console.warn("Falha ao criar plano via API. Usando fallback local.", error);
      planAvailable = false;
    }
  }

  const fallbackPlan = createFallbackPlan(payload);
  return { ...fallbackPlan, source: "fallback" };
}

export async function getLibrary({ area = "all", ageRange }) {
  const cacheKey = JSON.stringify({ area, ageRange });
  if (libraryCache.has(cacheKey)) {
    return libraryCache.get(cacheKey);
  }

  if (libraryAvailable) {
    try {
      const params = new URLSearchParams();
      if (ageRange) params.set("ageRange", ageRange);
      if (area && area !== "all") params.set("area", area);

      const queryString = params.toString();
      const url = queryString ? `${API_BASE}/api/library?${queryString}` : `${API_BASE}/api/library`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erro ${response.status}`);
      }

      const data = await response.json();
      const normalized = { items: data.items ?? [], source: "api" };
      libraryCache.set(cacheKey, normalized);
      return normalized;
    } catch (error) {
      console.warn("Falha ao carregar biblioteca via API. Usando fallback local.", error);
      libraryAvailable = false;
    }
  }

  const items = filterFallbackLibrary(area, ageRange);
  const normalized = { items, source: "fallback" };
  libraryCache.set(cacheKey, normalized);
  return normalized;
}

export function getApiBase() {
  return API_BASE;
}
