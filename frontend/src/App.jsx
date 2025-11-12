import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { getMeta, createPlan, getLibrary, getApiBase } from "./services/api.js";
import { areaLabels as fallbackAreas, ageLabels as fallbackAges } from "./data/fallback.js";

const initialFormState = {
  motherName: "",
  childName: "",
  ageRange: "",
  focus: [],
  challenge: "",
};

function App() {
  const [form, setForm] = useState(initialFormState);
  const [meta, setMeta] = useState({
    areas: fallbackAreas,
    ages: fallbackAges,
    source: "fallback",
  });
  const [plan, setPlan] = useState(null);
  const [planStatus, setPlanStatus] = useState("idle");
  const [planError, setPlanError] = useState(null);
  const [libraryArea, setLibraryArea] = useState("all");
  const [activeAgeRange, setActiveAgeRange] = useState(null);
  const [libraryState, setLibraryState] = useState({ items: [], source: "fallback" });
  const [libraryStatus, setLibraryStatus] = useState("idle");
  const [diaryEntry, setDiaryEntry] = useState("");
  const [diaryStatus, setDiaryStatus] = useState("");
  const [breathingStatus, setBreathingStatus] = useState("");

  const dashboardRef = useRef(null);
  const apiBase = useMemo(() => getApiBase(), []);

  useEffect(() => {
    let mounted = true;
    async function loadMeta() {
      const metaResponse = await getMeta();
      if (mounted) {
        setMeta(metaResponse);
      }
    }
    loadMeta();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadLibrary() {
      try {
        setLibraryStatus("loading");
        const libraryResponse = await getLibrary({
          area: libraryArea,
          ageRange: activeAgeRange,
        });
        if (!cancelled) {
          setLibraryState(libraryResponse);
          setLibraryStatus("success");
        }
      } catch (error) {
        console.error("Erro ao carregar biblioteca:", error);
        if (!cancelled) {
          setLibraryStatus("error");
          setLibraryState({ items: [], source: "fallback" });
        }
      }
    }
    loadLibrary();
    return () => {
      cancelled = true;
    };
  }, [libraryArea, activeAgeRange]);

  const areaOptions = useMemo(() => Object.entries(meta.areas ?? {}), [meta.areas]);
  const focusSelected = useMemo(() => new Set(form.focus), [form.focus]);
  const focusForLibrary = plan?.summary?.focus ?? [];

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFocusToggle = (value) => {
    setForm((prev) => {
      const current = new Set(prev.focus);
      if (current.has(value)) {
        current.delete(value);
      } else {
        current.add(value);
      }
      return { ...prev, focus: Array.from(current) };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPlanStatus("loading");
    setPlanError(null);
    try {
      const payload = {
        motherName: form.motherName.trim() || undefined,
        childName: form.childName.trim() || undefined,
        ageRange: form.ageRange,
        focus: form.focus,
        challenge: form.challenge.trim(),
      };

      const planResponse = await createPlan(payload);
      setPlan(planResponse);
      setPlanStatus("success");
      setActiveAgeRange(planResponse.summary.ageRange);
      setLibraryArea("all");
      dashboardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      console.error("Erro ao gerar plano:", error);
      setPlanStatus("error");
      setPlanError("Não foi possível gerar o plano agora. Tente novamente em instantes.");
    }
  };

  const handleDiarySave = () => {
    if (!diaryEntry.trim()) {
      setDiaryStatus("Escreva ao menos uma frase sobre como você está se sentindo.");
      return;
    }
    setDiaryStatus("Registro salvo! Observe padrões ao longo da semana para novos cuidados.");
    setDiaryEntry("");
  };

  const handleBreathing = () => {
    setBreathingStatus("Iniciando sequência 4-4-6. Inspire... segure... expire...");
    setTimeout(() => {
      setBreathingStatus("Perceba como está agora. Registre no diário se notar mudanças.");
    }, 12000);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="logo">Bem-Estar em Família</div>
        <nav>
          <a href="#onboarding">Onboarding</a>
          <a href="#dashboard">Dashboard</a>
          <a href="#library">Biblioteca</a>
          <a href="#emotional">Apoio Emocional</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="hero">
          <div className="hero__copy">
            <h1>
              Planos personalizados para mães e filhos de 0 a 5 anos em um só lugar
            </h1>
            <p>
              Acompanhe rotina, saúde, alimentação, sono, desenvolvimento e apoio emocional com
              recomendações diárias adaptadas ao momento da sua família.
            </p>
            <button className="cta" onClick={() => document.querySelector("#onboarding")?.scrollIntoView({ behavior: "smooth" })}>
              Começar o onboarding
            </button>
            <p className="microcopy">
              API mock: <span className="badge badge--ghost">{apiBase}</span>
              {meta.source === "fallback" && (
                <span className="badge badge--warning">modo offline</span>
              )}
            </p>
          </div>
          <div className="hero__card">
            <p className="hero__card-title">Plano do dia · exemplo</p>
            <ul>
              <li>08:00 · Café da manhã com frutas</li>
              <li>10:30 · Soneca curta com ambiente calmo</li>
              <li>12:30 · Consulta com pediatra (lembrete)</li>
              <li>15:00 · Atividade sensorial com texturas</li>
            </ul>
          </div>
        </section>

        <section className="panel" id="onboarding">
          <div className="panel__header">
            <h2>1. Onboarding inteligente</h2>
            <p>
              Responda rapidamente para receber um plano semanal personalizado para você e sua criança.
            </p>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <div className="form__group">
              <label htmlFor="motherName">Seu nome</label>
              <input
                id="motherName"
                name="motherName"
                type="text"
                placeholder="Ex: Ana"
                value={form.motherName}
                onChange={handleInputChange("motherName")}
                autoComplete="name"
                required
              />
            </div>

            <div className="form__group">
              <label htmlFor="childName">Nome da criança</label>
              <input
                id="childName"
                name="childName"
                type="text"
                placeholder="Ex: Sofia"
                value={form.childName}
                onChange={handleInputChange("childName")}
                required
              />
            </div>

            <div className="form__group">
              <label htmlFor="ageRange">Idade da criança</label>
              <select
                id="ageRange"
                name="ageRange"
                value={form.ageRange}
                onChange={handleInputChange("ageRange")}
                required
              >
                <option value="" disabled>
                  Selecione
                </option>
                {Object.entries(meta.ages ?? {}).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form__group">
              <span>Quais áreas você deseja priorizar?</span>
              <div className="chips" role="group" aria-label="Áreas prioritárias">
                {areaOptions.map(([value, label]) => (
                  <label className={`chip ${focusSelected.has(value) ? "chip--active" : ""}`} key={value}>
                    <input
                      type="checkbox"
                      name="focus"
                      value={value}
                      checked={focusSelected.has(value)}
                      onChange={() => handleFocusToggle(value)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form__group">
              <label htmlFor="challenge">Maior desafio atual</label>
              <textarea
                id="challenge"
                name="challenge"
                rows={3}
                placeholder="Conte rapidamente qual é a sua principal dificuldade no momento"
                value={form.challenge}
                onChange={handleInputChange("challenge")}
              />
            </div>

            <div className="form__actions">
              <button className="cta" type="submit" disabled={planStatus === "loading"}>
                {planStatus === "loading" ? "Gerando plano..." : "Gerar plano da semana"}
              </button>
              {plan?.source === "fallback" && (
                <span className="microcopy status-pill">
                  Plano gerado localmente (sem conexão com API)
                </span>
              )}
              {planStatus === "error" && planError && (
                <span className="alert">{planError}</span>
              )}
            </div>
          </form>
        </section>

        <section className="panel panel--alt" id="dashboard" ref={dashboardRef}>
          <div className="panel__header">
            <h2>2. Dashboard personalizado</h2>
            <p>
              Visualize o plano semanal, metas de hábitos e orientações adaptadas às suas prioridades.
            </p>
          </div>

          {plan ? (
            <Dashboard plan={plan} areaLabels={meta.areas} ageLabels={meta.ages} />
          ) : (
            <div className="dashboard dashboard__empty">
              <p>Complete o onboarding para gerar um plano personalizado para sua família.</p>
            </div>
          )}
        </section>

        <section className="panel" id="library">
          <div className="panel__header">
            <h2>3. Biblioteca curada por especialistas</h2>
            <p>
              Conteúdo confiável para cada fase do desenvolvimento, filtrado por tema e faixa etária.
            </p>
          </div>

          <div className="filters">
            <button
              type="button"
              className={`filter ${libraryArea === "all" ? "is-active" : ""}`}
              onClick={() => setLibraryArea("all")}
            >
              Tudo
            </button>
            {areaOptions.map(([value, label]) => (
              <button
                type="button"
                key={value}
                className={`filter ${libraryArea === value ? "is-active" : ""}`}
                onClick={() => setLibraryArea(value)}
              >
                {label}
              </button>
            ))}
          </div>

          <LibrarySection
            status={libraryStatus}
            library={libraryState}
            areaLabels={meta.areas}
            recommendedAreas={focusForLibrary}
          />
        </section>

        <section className="panel panel--alt" id="emotional">
          <div className="panel__header">
            <h2>4. Apoio emocional e autocuidado</h2>
            <p>
              Cuide de você com registros rápidos, exercícios guiados e acesso à rede de apoio.
            </p>
          </div>

          <div className="emotional">
            <div className="emotional__card">
              <h3>Diário rápido</h3>
              <textarea
                rows={4}
                placeholder="Como você está se sentindo hoje?"
                value={diaryEntry}
                onChange={(event) => {
                  setDiaryEntry(event.target.value);
                  setDiaryStatus("");
                }}
              />
              <button className="secondary" type="button" onClick={handleDiarySave}>
                Salvar registro
              </button>
              {diaryStatus && <p className="microcopy">{diaryStatus}</p>}
            </div>

            <div className="emotional__card">
              <h3>Exercício guiado</h3>
              <ol>
                <li>Respire profundamente por 4 segundos.</li>
                <li>Segure o ar por 4 segundos.</li>
                <li>Expire lentamente por 6 segundos.</li>
                <li>Repita pelo menos 4 vezes.</li>
              </ol>
              <button className="secondary" type="button" onClick={handleBreathing}>
                Iniciar exercício
              </button>
              {breathingStatus && <p className="microcopy">{breathingStatus}</p>}
            </div>

            <div className="emotional__card">
              <h3>Rede de apoio</h3>
              <ul className="support-list">
                <li>
                  <span>Canal com psicóloga parceira (agendamento)</span>
                  <button className="ghost" type="button">
                    Saber mais
                  </button>
                </li>
                <li>
                  <span>Grupo moderado: Mães de bebês até 1 ano</span>
                  <button className="ghost" type="button">
                    Participar
                  </button>
                </li>
                <li>
                  <span>Plantão de dúvidas com consultora de amamentação</span>
                  <button className="ghost" type="button">
                    Reservar vaga
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>
          Protótipo MVP · Conteúdo demonstrativo · {new Date().getFullYear()} · Desenvolvido para mães cuidadoras e suas famílias.
        </p>
      </footer>
    </div>
  );
}

function Dashboard({ plan, areaLabels, ageLabels }) {
  const { summary, schedule = [], habits = [], insights = [], recommendedContent = [] } = plan;

  return (
    <div className="dashboard-grid">
      <article className="dash-card">
        <h3>
          Olá, {summary.motherName || "mãe"}!
          <span className="badge">{ageLabels?.[summary.ageRange] ?? summary.ageRange}</span>
        </h3>
        <p>
          Plano da semana para {summary.childName || "sua criança"}, considerando as prioridades escolhidas.
        </p>
        <div className="microcopy">Áreas prioritárias</div>
        <div className="badge-list">
          {summary.focus.map((focus) => (
            <span key={focus} className="badge badge--outline">
              {areaLabels?.[focus] ?? focus}
            </span>
          ))}
        </div>
        {summary.challenge && (
          <div className="microcopy challenge">
            <strong>Desafio atual:</strong> {summary.challenge}
          </div>
        )}
        {plan.source === "fallback" && (
          <span className="badge badge--warning">dados locais</span>
        )}
      </article>

      <article className="dash-card">
        <h3>
          Agenda sugerida <span className="badge">Dia típico</span>
        </h3>
        <ul className="timeline">
          {schedule.map((item) => (
            <li key={`${item.time}-${item.title}`}>
              <time>{item.time}</time>
              <div>
                <p>{item.title}</p>
                <span>{item.detail}</span>
              </div>
              {summary.focus.includes(item.area) && (
                <span className="badge badge--outline">
                  {areaLabels?.[item.area] ?? item.area}
                </span>
              )}
            </li>
          ))}
        </ul>
      </article>

      <article className="dash-card">
        <h3>
          Metas da semana <span className="badge">Hábitos</span>
        </h3>
        <ul className="habit-list">
          {habits.map((habit) => (
            <li key={habit.label}>
              <span>{habit.label}</span>
              <small>{habit.detail}</small>
            </li>
          ))}
        </ul>
        <p className="microcopy">
          Mantenha os registros atualizados para receber novos ajustes automaticamente.
        </p>
      </article>

      <article className="dash-card">
        <h3>
          Insights personalizados <span className="badge">Sugestões</span>
        </h3>
        <ul className="timeline">
          {insights.map((tip) => (
            <li key={tip.title}>
              <time>{areaLabels?.[tip.area] ?? tip.area}</time>
              <div>
                <p>{tip.title}</p>
                <span>{tip.detail}</span>
              </div>
            </li>
          ))}
        </ul>
      </article>

      {!!recommendedContent.length && (
        <article className="dash-card dash-card--wide">
          <h3>
            Conteúdos recomendados <span className="badge">Plano</span>
          </h3>
          <ul className="recommended-list">
            {recommendedContent.slice(0, 4).map((item) => (
              <li key={item.id}>
                <div>
                  <p>{item.title}</p>
                  <span>{item.summary}</span>
                </div>
                <span className="badge badge--outline">
                  {areaLabels?.[item.area] ?? item.area}
                </span>
              </li>
            ))}
          </ul>
        </article>
      )}
    </div>
  );
}

function LibrarySection({ status, library, areaLabels, recommendedAreas }) {
  if (status === "loading") {
    return (
      <div className="dashboard__empty">
        <p>Carregando biblioteca...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="dashboard__empty">
        <p>Não foi possível carregar a biblioteca. Tente novamente.</p>
      </div>
    );
  }

  if (!library.items.length) {
    return (
      <div className="dashboard__empty">
        <p>Nenhum conteúdo encontrado para os filtros selecionados.</p>
      </div>
    );
  }

  const recommendedSet = new Set(recommendedAreas);

  return (
    <>
      <div className="card-grid">
        {library.items.map((item) => {
          const isRecommended = recommendedSet.has(item.area);
          return (
            <article className="content-card" key={item.id}>
              <span className="tag">
                {areaLabels?.[item.area] ?? item.area} · {item.format}
              </span>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <button className={isRecommended ? "secondary" : "ghost"} type="button">
                {isRecommended ? "Adicionar ao plano" : "Detalhes"}
              </button>
            </article>
          );
        })}
      </div>
      <p className="microcopy source-indicator">
        Fonte: {library.source === "api" ? "API mock" : "dados locais"}
      </p>
    </>
  );
}

export default App;
