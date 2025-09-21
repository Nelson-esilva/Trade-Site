# Frontend Requirements

## Dependências Principais

### Core React
- **react**: ^19.1.0 - Biblioteca principal do React
- **react-dom**: ^19.1.0 - DOM renderer para React
- **react-scripts**: 5.0.1 - Scripts de build e desenvolvimento

### Roteamento
- **react-router-dom**: ^7.7.0 - Roteamento para aplicações React

### UI Framework
- **@mui/material**: ^7.2.0 - Componentes Material-UI
- **@mui/icons-material**: ^7.2.0 - Ícones Material-UI
- **@mui/x-date-pickers**: ^8.9.0 - Seletores de data
- **@emotion/react**: ^11.14.0 - CSS-in-JS
- **@emotion/styled**: ^11.14.1 - Styled components

### Formulários e Validação
- **react-hook-form**: ^7.60.0 - Gerenciamento de formulários
- **@hookform/resolvers**: ^5.1.1 - Resolvers para validação
- **yup**: ^1.6.1 - Schema de validação

### Utilitários
- **dayjs**: ^1.11.13 - Manipulação de datas
- **web-vitals**: ^2.1.4 - Métricas de performance

### Testes
- **@testing-library/react**: ^16.3.0 - Testes para React
- **@testing-library/jest-dom**: ^6.6.4 - Matchers para Jest
- **@testing-library/user-event**: ^13.5.0 - Simulação de eventos
- **@testing-library/dom**: ^10.4.0 - Testes para DOM

### Desenvolvimento
- **eslint-config-react-app**: ^7.0.1 - Configuração ESLint

## Versões do Node.js

- **Node.js**: >= 18.0.0 (recomendado 18.x ou superior)
- **npm**: >= 9.0.0

## Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm build` - Cria build de produção
- `npm test` - Executa testes
- `npm eject` - Ejecta configurações (não recomendado)

## Variáveis de Ambiente

- `REACT_APP_API_URL` - URL da API backend (padrão: http://localhost:8000/api)
- `CHOKIDAR_USEPOLLING` - Habilita polling para hot reload no Docker

## Estrutura do Projeto

```
frontend/
├── public/                 # Arquivos estáticos
├── src/
│   ├── components/         # Componentes reutilizáveis
│   ├── contexts/          # Contextos React
│   ├── pages/             # Páginas da aplicação
│   ├── services/          # Serviços (API, etc.)
│   ├── App.jsx            # Componente principal
│   └── index.jsx          # Ponto de entrada
├── package.json           # Dependências e scripts
├── Dockerfile            # Configuração Docker
└── docker-compose.yml    # Orquestração Docker
```

## Comandos Docker

### Desenvolvimento
```bash
# Construir e rodar
docker-compose up --build

# Rodar em background
docker-compose up -d

# Parar
docker-compose down
```

### Produção
```bash
# Build de produção
docker build -t frontend-prod .

# Rodar container de produção
docker run -p 3000:3000 frontend-prod
```
