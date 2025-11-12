## Modelagem de Dados & Fluxo de Personalização

### Entidades Principais
- **User (Mãe/Responsável)**
  - id, nome, email, telefone, data_nascimento, senha_hash, onboarding_status.
  - preferências (receber notificações, canais, idioma).
  - consentimentos (LGPD).
- **Child (Filho)**
  - id, user_id, nome, data_nascimento, gênero, histórico de saúde, alergias.
  - indicadores de desenvolvimento (peso, altura, percentil).
- **Professional (Especialista)**
  - id, nome, especialidade, registro profissional, bio, disponibilidade.
- **PlanTemplate**
  - id, faixa_etaria_min/max (em meses), foco (rotina, sono, etc.), objetivos.
  - lista de tarefas padrão, conteúdos sugeridos.
- **PersonalizedPlan**
  - id, child_id, periodo (semana atual), status, score de aderência.
  - metas priorizadas (JSONB).
- **Task (Meta/Tarefa)**
  - id, personalized_plan_id, tipo (rotina, saúde...), descrição, frequência, horário sugerido, status.
- **Content (Artigo/Checklist/Atividade)**
  - id, título, tipo, faixa_etaria, tags (sono, alimentação), nível (iniciante, avançado).
  - corpo (markdown/html), autor (professional_id opcional).
- **HabitLog (Registro)**
  - id, child_id, categoria (sono, alimentação), valores (duracao, quantidade), timestamp.
  - humor/observações.
- **Notification**
  - id, user_id, tipo (push, email), payload, status (agendada, enviada, cancelada).
- **Feedback**
  - id, personalized_plan_id, rating, comentários, data.
- **CommunityPost/SupportEntry** *(fase futura)*  
  - Para recursos de apoio emocional comunitário.

### Relacionamentos Resumidos
- User 1—N Child.
- Child 1—N PersonalizedPlan; PersonalizedPlan 1—N Task.
- PlanTemplate 1—N Content (associação via tabela de ligação PlanTemplateContent).
- PersonalizedPlan N—N Content (via PlanContentRelation com peso/prioridade).
- Child 1—N HabitLog.
- User 1—N Notification.
- PersonalizedPlan 1—N Feedback.

### Estrutura Exemplo (PostgreSQL)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  birth_date DATE,
  phone TEXT,
  preferences JSONB DEFAULT '{}',
  consents JSONB DEFAULT '{}',
  onboarding_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE children (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  gender TEXT,
  medical_notes JSONB DEFAULT '{}',
  growth_stats JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE personalized_plans (
  id UUID PRIMARY KEY,
  child_id UUID REFERENCES children(id),
  week_start DATE NOT NULL,
  status TEXT DEFAULT 'active',
  priority_focus TEXT,
  meta JSONB,
  adherence_score NUMERIC,
  created_at TIMESTAMP DEFAULT NOW()
);
```

*(Demais tabelas seguem padrão similar, mantendo JSONB para flexibilidade em metas e respostas).*

### Fluxo de Personalização
1. **Coleta de Perfil**
   - Usuária fornece dados pessoais, contexto familiar, desafios atuais.
   - Para cada criança: idade, marcos já atingidos, histórico médico.
2. **Processamento**
   - Motor avalia faixa etária, respostas do questionário e hábitos existentes.
   - Seleciona `PlanTemplate` adequado e ajusta prioridades (ex. foco em sono).
   - Gera `PersonalizedPlan` com tarefas e conteúdos categorizados.
3. **Entrega**
   - App mostra plano semanal com metas diárias, conteúdos e lembretes.
   - Notificações programadas conforme horários e eventos.
4. **Monitoramento**
   - Usuária registra hábitos; `HabitLog` dispara eventos ao motor.
   - Motor recalcula metas, ajusta níveis de dificuldade e propõe novos conteúdos.
   - Caso metas não sejam cumpridas, sugere alternativas/apoio emocional.
5. **Feedback**
   - Ao final da semana, coleta feedback e atualiza score de aderência.
   - Dados alimentam analytics e melhoram planos futuros.

### Regras de Negócio (Exemplos)
- Idade em meses define faixa de conteúdo (0-3, 4-6, 7-12, 13-24, 25-36, 37-60).
- Alertas de saúde (vacinas) baseados em calendário oficial + dados `medical_notes`.
- Se `HabitLog` indicar sono < recomendado por 3 dias consecutivos, priorizar tarefas de higiene do sono e enviar dica extra.
- Gatilhos emocionais: se usuária registrar humor baixo 2 dias seguidos, sugerir atividade de autocuidado e canal de apoio.

### Considerações para Escalabilidade de Dados
- Utilizar `JSONB` para atributos variáveis (questionário, metas dinâmicas).
- Indexação em campos de busca (tags, faixa etária, status).
- Eventos assíncronos via fila para reprocessar planos em lote.
- Retenção de dados sensíveis seguindo políticas de privacidade e exclusão sob demanda.
