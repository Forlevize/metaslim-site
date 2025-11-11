export const areaLabels = {
  rotina: "Rotina",
  saude: "Saúde",
  alimentacao: "Alimentação",
  sono: "Sono",
  desenvolvimento: "Desenvolvimento",
  emocional: "Apoio Emocional",
};

export const ageLabels = {
  "0-3": "0-3 meses",
  "4-6": "4-6 meses",
  "7-12": "7-12 meses",
  "13-24": "1-2 anos",
  "25-36": "2-3 anos",
  "37-60": "3-5 anos",
};

export const planSchedule = {
  "0-3": [
    {
      time: "07:00",
      title: "Amamentação ou fórmula",
      detail: "Alimentação responsiva observando sinais de fome.",
      area: "alimentacao",
    },
    {
      time: "08:30",
      title: "Soneca curta",
      detail: "Ambiente escuro, ruído branco suave.",
      area: "sono",
    },
    {
      time: "10:00",
      title: "Tempo de colo e vínculo",
      detail: "Contato pele a pele para fortalecer vínculo.",
      area: "emocional",
    },
    {
      time: "12:00",
      title: "Hidratação da mãe",
      detail: "Lembre-se de beber água a cada mamada.",
      area: "saude",
    },
    {
      time: "15:00",
      title: "Estimulação sensorial",
      detail: "Brinquedos com texturas e contraste alto.",
      area: "desenvolvimento",
    },
  ],
  "4-6": [
    {
      time: "07:30",
      title: "Rotina matinal",
      detail: "Troca, alongamento suave e conversa afetiva.",
      area: "rotina",
    },
    {
      time: "09:30",
      title: "Introdução alimentar",
      detail: "Papinhas ricas em ferro e alimentos amassados.",
      area: "alimentacao",
    },
    {
      time: "12:00",
      title: "Check-up rápido",
      detail: "Observar temperatura e sinais de desconforto.",
      area: "saude",
    },
    {
      time: "14:00",
      title: "Soneca guiada",
      detail: "Ritual com música calma e quarto escuro.",
      area: "sono",
    },
    {
      time: "17:00",
      title: "Brincadeira de rolar",
      detail: "Estimula coordenação motora e confiança.",
      area: "desenvolvimento",
    },
  ],
  "7-12": [
    {
      time: "07:30",
      title: "Café da manhã nutritivo",
      detail: "Frutas amassadas com aveia e iogurte natural.",
      area: "alimentacao",
    },
    {
      time: "09:00",
      title: "Atividade musical",
      detail: "Cantigas com gestos para linguagem e vínculo.",
      area: "desenvolvimento",
    },
    {
      time: "11:30",
      title: "Soneca estruturada",
      detail: "Ambiente calmo, ruído branco e objeto de apego.",
      area: "sono",
    },
    {
      time: "14:00",
      title: "Consulta pediátrica mensal",
      detail: "Revisar carteira de vacinação e medidas.",
      area: "saude",
    },
    {
      time: "16:30",
      title: "Tempo ao ar livre",
      detail: "Parque ou varanda com estímulos visuais.",
      area: "rotina",
    },
  ],
  "13-24": [
    {
      time: "07:00",
      title: "Café completo",
      detail: "Ovos mexidos, frutas e um carboidrato complexo.",
      area: "alimentacao",
    },
    {
      time: "09:00",
      title: "Atividade sensorial",
      detail: "Pintura com dedos para coordenação fina.",
      area: "desenvolvimento",
    },
    {
      time: "12:00",
      title: "Rotina de higiene",
      detail: "Escovar dentes com creme infantil e cantar música.",
      area: "saude",
    },
    {
      time: "13:00",
      title: "Soneca principal",
      detail: "Ritual de leitura curta e ambiente escuro.",
      area: "sono",
    },
    {
      time: "16:30",
      title: "Tempo em família",
      detail: "Conversar sobre sentimentos do dia com a criança.",
      area: "emocional",
    },
  ],
  "25-36": [
    {
      time: "07:30",
      title: "Rotina de autonomia",
      detail: "Deixe a criança escolher a roupa entre opções.",
      area: "desenvolvimento",
    },
    {
      time: "09:00",
      title: "Lanche equilibrado",
      detail: "Fruta + oleaginosa + carboidrato integral.",
      area: "alimentacao",
    },
    {
      time: "11:00",
      title: "Consulta odontológica (semestre)",
      detail: "Agendar revisão para saúde bucal.",
      area: "saude",
    },
    {
      time: "14:00",
      title: "Atividade ao ar livre",
      detail: "Circuito motor simples ou passeio no parque.",
      area: "rotina",
    },
    {
      time: "19:30",
      title: "Higiene do sono",
      detail: "Banho morno, história tranquila e luz baixa.",
      area: "sono",
    },
  ],
  "37-60": [
    {
      time: "07:00",
      title: "Planejamento do dia",
      detail: "Criar juntos a agenda com ícones divertidos.",
      area: "rotina",
    },
    {
      time: "10:00",
      title: "Lanche colorido",
      detail: "Incluir 3 cores diferentes de alimentos.",
      area: "alimentacao",
    },
    {
      time: "13:00",
      title: "Momento de aprendizado",
      detail: "Jogo de montar histórias para estimular linguagem.",
      area: "desenvolvimento",
    },
    {
      time: "16:00",
      title: "Consulta preventiva",
      detail: "Verificar agenda de vacinas e crescimento.",
      area: "saude",
    },
    {
      time: "20:00",
      title: "Gratidão em família",
      detail: "Cada um compartilha algo bom do dia.",
      area: "emocional",
    },
  ],
};

export const habitRecommendations = {
  "0-3": [
    { label: "Horas de sono", detail: "14-17h distribuídas em 4-5 sonecas." },
    { label: "Alimentação", detail: "Amamentação sob livre demanda." },
    { label: "Autocuidado materno", detail: "Intervalo de 20 min para descanso." },
  ],
  "4-6": [
    { label: "Sono noturno", detail: "10-12h contínuas, 2-3 sonecas." },
    { label: "Introdução alimentar", detail: "2 refeições sólidas + 1 fruta." },
    { label: "Hidratação", detail: "Mãe: 2,5L/dia; bebê: água após refeições." },
  ],
  "7-12": [
    { label: "Rotina", detail: "Janelas de sono a cada 3h." },
    { label: "Estimulação", detail: "15 min/dia de leitura compartilhada." },
    { label: "Saúde", detail: "Calendário de vacinas atualizado." },
  ],
  "13-24": [
    { label: "Sono", detail: "11-14h/dia com 1-2 sonecas." },
    { label: "Alimentação", detail: "3 refeições + 2 lanches variados." },
    { label: "Movimento", detail: "60 min de brincadeira ativa." },
  ],
  "25-36": [
    { label: "Autonomia", detail: "Envolver em tarefas simples (guardar brinquedos)." },
    { label: "Sono", detail: "11-13h com rotina consistente." },
    { label: "Saúde emocional", detail: "Check-in diário: como você se sente?" },
  ],
  "37-60": [
    { label: "Sono", detail: "10-13h com ritual fixo." },
    { label: "Aprendizado", detail: "Atividades de pré-alfabetização 20 min/dia." },
    { label: "Saúde", detail: "Consulta anual e rastreio visual/auditivo." },
  ],
};

export const contentLibrary = [
  {
    id: 1,
    title: "Checklist da rotina matinal tranquila",
    summary:
      "Passo a passo para organizar manhãs com menos estresse e mais previsibilidade.",
    area: "rotina",
    age: ["0-3", "4-6", "7-12"],
    format: "Checklist",
  },
  {
    id: 2,
    title: "Agenda de vacinas até os 5 anos",
    summary:
      "Linha do tempo completa com lembretes para cada fase e sinais de alerta.",
    area: "saude",
    age: ["0-3", "4-6", "7-12", "13-24", "25-36", "37-60"],
    format: "Guia",
  },
  {
    id: 3,
    title: "Cardápios semanais equilibrados",
    summary:
      "Sugestões por faixa etária com ingredientes acessíveis e substituições.",
    area: "alimentacao",
    age: ["4-6", "7-12", "13-24", "25-36", "37-60"],
    format: "Planner",
  },
  {
    id: 4,
    title: "Higiene do sono: ritual noturno",
    summary:
      "Como criar um ritual consistente e ajustar o ambiente para noites tranquilas.",
    area: "sono",
    age: ["0-3", "4-6", "7-12", "13-24", "25-36"],
    format: "Artigo",
  },
  {
    id: 5,
    title: "Brincadeiras para cada marco de desenvolvimento",
    summary:
      "Atividades sensoriais, motoras e cognitivas separadas por idade.",
    area: "desenvolvimento",
    age: ["0-3", "4-6", "7-12", "13-24", "25-36"],
    format: "Atividades",
  },
  {
    id: 6,
    title: "Primeiros cuidados emocionais da mãe",
    summary:
      "Técnicas curtas de respiração, diário de gratidão e momentos de pausa.",
    area: "emocional",
    age: ["0-3", "4-6", "7-12", "13-24", "25-36", "37-60"],
    format: "Guia",
  },
  {
    id: 7,
    title: "Plano semanal de rotinas compartilhadas",
    summary:
      "Estratégias para dividir tarefas entre cuidadores e manter consistência.",
    area: "rotina",
    age: ["13-24", "25-36", "37-60"],
    format: "Modelo",
  },
  {
    id: 8,
    title: "Sinais de alerta que exigem consulta médica",
    summary:
      "Checklist para identificar sintomas importantes e agir com segurança.",
    area: "saude",
    age: ["0-3", "4-6", "7-12", "13-24", "25-36", "37-60"],
    format: "Checklist",
  },
  {
    id: 9,
    title: "Receitas rápidas para picky eaters",
    summary:
      "Como apresentar novos sabores e texturas para crianças seletivas.",
    area: "alimentacao",
    age: ["25-36", "37-60"],
    format: "Receitas",
  },
  {
    id: 10,
    title: "Mindfulness para mães ocupadas",
    summary:
      "Práticas de 5 minutos para reduzir a ansiedade e criar espaço mental.",
    area: "emocional",
    age: ["0-3", "4-6", "7-12", "13-24", "25-36", "37-60"],
    format: "Audio-guia",
  },
];

export function generateInsights(focus) {
  const templates = {
    rotina: {
      title: "Crie check-ins de rotina",
      detail:
        "Defina alertas 30 minutos antes das transições mais sensíveis do seu dia.",
    },
    saude: {
      title: "Monitore sinais importantes",
      detail:
        "Registre temperatura, evacuações e humor para facilitar consultas médicas.",
    },
    alimentacao: {
      title: "Inclua variedade inteligente",
      detail:
        "Apresente novos alimentos no almoço, quando a criança está mais receptiva.",
    },
    sono: {
      title: "Ritual consistente é chave",
      detail:
        "Repita 3 passos: banho morno, história curta e canção suave antes de dormir.",
    },
    desenvolvimento: {
      title: "Brincar é aprender",
      detail:
        "Separe 15 minutos com brinquedos que desafiem novas habilidades diariamente.",
    },
    emocional: {
      title: "Cuide de você para cuidar melhor",
      detail:
        "Reserve micro-pausas ao longo do dia e registre emoções no diário rápido.",
    },
  };

  return focus.slice(0, 3).map((area) => ({
    area,
    ...templates[area],
  }));
}
