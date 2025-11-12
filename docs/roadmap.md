## Roadmap MVP · Sistema de Apoio para Mães

### Fase 0 · Planejamento & Discovery (Semanas 1-2)
- Entrevistas rápidas com mães (5-7) e especialistas para validar dores.
- Refinamento dos requisitos e priorização de funcionalidades do MVP.
- Definição de métricas chave e KPIs iniciais.
- Prototipagem de baixa fidelidade (wireframes onboarding, dashboard, registro).
- Plano de conteúdo inicial (artigos, checklists, atividades) com especialistas.

### Fase 1 · Fundamentos Técnicos (Semanas 3-6)
- Setup de repositórios, CI/CD, ambientes (dev/stage).
- Implementação do backend base (NestJS): autenticação, CRUD de usuários/crianças.
- Configuração do banco PostgreSQL e schema inicial.
- Motor de personalização (versão 1): regras determinísticas por faixa etária.
- Protótipo mobile (Flutter) com onboarding e dashboard básico.
- Integração push notifications (FCM) no ambiente de teste.

### Fase 2 · Plano Personalizado & Conteúdo (Semanas 7-10)
- Implementar questionário inicial e coleta de perfis.
- Geração do plano semanal com tarefas e conteúdos associados.
- Biblioteca de conteúdos com filtros por idade/tema.
- Registro de hábitos (sono, alimentação, saúde) com gráficos simples.
- Área de apoio emocional (diário guiado, exercícios de respiração).
- Painel admin (web) mínimo para gestão de conteúdo e planos.

### Fase 3 · Ajustes Dinâmicos & Observabilidade (Semanas 11-14)
- Ajustes automáticos do plano com base nos hábitos registrados.
- Sistema de feedback semanal e recalibração de metas.
- Dashboards de métricas (engajamento, adesão).
- Implementação de monitoramento (logs, alertas) e analytics.
- Testes funcionais, carga leve e revisão de segurança (LGPD).

### Fase 4 · Beta Fechado & Go-Live (Semanas 15-18)
- Programa beta com 30-50 mães (incentivo e suporte dedicado).
- Coleta de feedback qualitativo e quantitativo.
- Ajustes finais: UX, performance, conteúdo adicional.
- Preparação para publicação em lojas (Google Play/TestFlight).
- Go-live controlado e planos de suporte pós-lançamento.

### Backlog Pós-MVP (Visão)
- Comunidade mediada (posts, comentários, moderadores).
- Integração com calendários externos e telemedicina.
- Algoritmo de recomendação com machine learning (personalização avançada).
- Gamificação (badges, reforços positivos).
- Planos multi cuidadores (vários responsáveis por criança).
- Conteúdo multimídia (vídeos, podcasts).

### Dependências & Recursos
- Time mínimo recomendado: 1 PM/UX, 1 Conteúdo/Curadoria, 2 Mobile devs, 2 Backend devs, 1 QA, 1 Especialista em dados (parcial).
- Ferramentas de suporte: Notion/Jira (gestão), Figma (design), Slack (comunicação).
- Orçamento para licenças (Auth0/Firebase/infra) e consultoria de especialistas.
