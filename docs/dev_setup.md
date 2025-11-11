## Setup de Desenvolvimento · Protótipo MVP

### Pré-requisitos
- Node.js 18+ (recomendado) e npm.
- Ambiente capaz de servir arquivos estáticos (Live Server, `http-server`, etc.) para a pasta `app/`.

### 1. Backend Mock (API)
```bash
cd server
npm install
npm run dev
# Servidor disponível em http://localhost:4000
```

Rotas disponíveis:
- `GET /health` – verificação rápida.
- `GET /api/meta` – metadados de áreas e faixas etárias.
- `GET /api/library?ageRange=7-12&area=sono` – conteúdos filtrados (parâmetros opcionais).
- `POST /api/plan` – gera plano personalizado com base no payload:
  ```json
  {
    "motherName": "Ana",
    "childName": "Sofia",
    "ageRange": "7-12",
    "focus": ["sono", "alimentacao"],
    "challenge": "Sonecas curtas durante o dia"
  }
  ```

### 2. Frontend (Protótipo)
1. Sirva a pasta `app/` com um servidor estático (ex.: `npx http-server app`).
2. Acesse `http://localhost:8080` (ou porta equivalente).
3. Preencha o formulário de onboarding; o front tentará consumir a API mock:
   - Se a API estiver rodando, os dados vêm do backend.
   - Caso contrário, o protótipo usa os dados estáticos locais como fallback.

### Variáveis de Ambiente (Opcional)
Defina `window.API_BASE_URL` antes de carregar `script.js` para apontar para outro host/porta:
```html
<script>
  window.API_BASE_URL = "https://meu-servidor.dev";
</script>
<script src="./script.js" type="module"></script>
```

### Próximos Passos Técnicos
- Substituir o protótipo estático por app real (Flutter ou React Native) consumindo a mesma API.
- Evoluir o backend mock para NestJS + banco relacional usando os modelos definidos em `docs/data_model.md`.
- Adicionar testes automatizados e pipeline CI/CD.
