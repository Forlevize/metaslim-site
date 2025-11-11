import express from "express";
import cors from "cors";

import {
  areaLabels,
  ageLabels,
  planSchedule,
  habitRecommendations,
  contentLibrary,
  generateInsights,
} from "./data.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "maternity-support-api", timestamp: Date.now() });
});

app.get("/api/meta", (_req, res) => {
  res.json({
    areas: areaLabels,
    ages: ageLabels,
  });
});

app.get("/api/library", (req, res) => {
  const { ageRange, area } = req.query;

  const filtered = contentLibrary.filter((item) => {
    const matchesArea = area ? item.area === area : true;
    const matchesAge = ageRange ? item.age.includes(ageRange) : true;
    return matchesArea && matchesAge;
  });

  res.json({
    total: filtered.length,
    items: filtered,
  });
});

app.post("/api/plan", (req, res) => {
  const {
    motherName = "Mãe",
    childName = "Criança",
    ageRange,
    focus: focusInput,
    challenge = "",
  } = req.body ?? {};

  if (!ageRange || !planSchedule[ageRange]) {
    return res.status(400).json({
      error: "invalid_age_range",
      message: "Informe uma faixa etária válida (ex: '0-3', '4-6').",
    });
  }

  const focus =
    Array.isArray(focusInput) && focusInput.length
      ? focusInput.filter((area) => areaLabels[area])
      : Object.keys(areaLabels);

  const schedule = planSchedule[ageRange];
  const habits = habitRecommendations[ageRange] ?? [];
  const insights = generateInsights(focus);

  const recommendedContent = contentLibrary.filter(
    (item) => focus.includes(item.area) && item.age.includes(ageRange)
  );

  res.json({
    summary: {
      motherName,
      childName,
      ageRange,
      challenge,
      focus,
    },
    schedule,
    habits,
    insights,
    recommendedContent,
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "not_found", path: req.path });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "internal_error" });
});

app.listen(PORT, () => {
  console.log(`Mock API rodando em http://localhost:${PORT}`);
});
