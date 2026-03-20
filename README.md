# 🎓 Trade Site - Plataforma de Troca de Materiais Didáticos

Uma plataforma completa para troca de materiais didáticos entre estudantes, desenvolvida com Django (backend) e React (frontend).

## 🚀 **Início Rápido com Docker**

### **Opção 1: Script Automático (Recomendado)**
```bash
./start.sh
```

### **Opção 2: Comando Manual**
```bash
docker-compose up --build
```

### **Parar a Aplicação**
```bash
./stop.sh
# ou
docker-compose down
```

## 🌐 **URLs de Acesso**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Admin Django**: http://localhost:8000/admin

## 🏗️ **Arquitetura**

### **Backend (Django)**
- **Framework**: Django 4.x + Django REST Framework
- **Banco**: PostgreSQL
- **Autenticação**: JWT (Simple JWT com refresh token)
- **APIs**: RESTful para itens, ofertas e usuários

### **Frontend (React)**
- **Framework**: React 19 + Material-UI
- **Roteamento**: React Router
- **Estado**: Context API
- **Estilo**: Material-UI com tema customizado

## 📁 **Estrutura do Projeto**

```
Trade-Site/
├── backend/                 # API Django
│   ├── auth_app/           # Autenticação
│   ├── items/              # Gestão de itens
│   ├── offers/             # Sistema de ofertas
│   ├── users/              # Gestão de usuários
│   ├── core/               # Configurações Django
│   └── requirements.txt    # Dependências Python
├── frontend/               # Interface React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── contexts/       # Gerenciamento de estado
│   │   └── services/       # Comunicação com API
│   └── package.json        # Dependências Node.js
├── docs/                   # Documentação consolidada
│   ├── DOCS_INDEX.md
│   ├── DOCUMENTATION.md
│   ├── API_DOCUMENTATION.md
│   ├── FRONTEND_DOCUMENTATION.md
│   ├── BACKEND_DOCUMENTATION.md
│   └── DOCKER_SETUP.md
├── docker-compose.yml      # Orquestração Docker
├── start.sh               # Script de inicialização
└── stop.sh                # Script de parada
```

## 🔧 **Funcionalidades**

### **✅ Implementadas**
- **Gestão de Itens**: Criar, listar, visualizar itens
- **Sistema de Ofertas**: Fazer, aceitar, recusar ofertas
- **Cancelamento de Oferta**: Usuário pode cancelar oferta pendente enviada
- **Busca e Filtros**: Buscar itens por texto e categoria
- **Interface Responsiva**: Design adaptável para mobile
- **Autenticação**: Login/registro com JWT e fluxo robusto
- **Upload de Imagem**: Suporte a Cloudinary em produção
- **API RESTful**: Endpoints completos para todas as operações

### **🔄 Em Desenvolvimento**
- Sistema de mensagens
- Notificações em tempo real
- Geolocalização
- Sistema de avaliações

## 🆕 **Atualizações de Hoje (20/03/2026)**

- **Autenticação robusta**: fluxo com JWT reforçado e pós-cadastro redirecionando para login.
- **Regras de negócio em ofertas**:
  - usuário não consegue ofertar no próprio item;
  - usuário pode cancelar oferta com status `pendente`.
- **Backend mais estável**:
  - adição dos endpoints `/` e `/healthz/` para health checks;
  - ordenação em ofertas para evitar `UnorderedObjectListWarning` na paginação;
  - correção de loop de requisições no detalhe de item.
- **Mídia em produção**:
  - integração opcional com Cloudinary via `USE_CLOUDINARY=true`;
  - fallback local quando `USE_CLOUDINARY=false`.
- **Frontend/UI**:
  - revisão visual ampla (header/menu superior, grid e cards mais consistentes, textos corrigidos UTF-8);
  - formulário de cadastro de item (`CreateItem`) redesenhado com melhor hierarquia visual, centralização e espaçamento.

## 🛠️ **Desenvolvimento**

### **Requisitos**
- Docker e Docker Compose
- Node.js 18+ (para desenvolvimento local)
- Python 3.11+ (para desenvolvimento local)

### **Comandos Úteis**

```bash
# Ver logs
docker-compose logs -f

# Entrar no container do backend
docker-compose exec backend bash

# Executar comandos Django
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser

# Entrar no container do frontend
docker-compose exec frontend sh

# Reinstalar dependências do frontend
docker-compose exec frontend npm install
```

## 📚 **Documentação Completa**

### 📖 Índice da Documentação
- **[📚 Índice da Documentação](docs/DOCS_INDEX.md)** - Navegação completa da documentação

### 📖 Documentação Principal
- **[📋 Documentação Completa](docs/DOCUMENTATION.md)** - Visão geral completa do projeto
- **[🔌 API Documentation](docs/API_DOCUMENTATION.md)** - Documentação detalhada da API
- **[⚛️ Frontend Documentation](docs/FRONTEND_DOCUMENTATION.md)** - Documentação do React
- **[🔧 Backend Documentation](docs/BACKEND_DOCUMENTATION.md)** - Documentação do Django

### 🐳 Deploy e Infraestrutura
- **[🐳 Docker Setup](docs/DOCKER_SETUP.md)** - Configuração e uso do Docker

## 🎯 **Próximos Passos**

1. **Cobertura de Testes**: Regras de negócio de oferta (incluindo cancelamento)
2. **Observabilidade**: Monitoramento de erros e métricas de API
3. **Chat**: Sistema de mensagens entre usuários
4. **Notificações**: Alertas em tempo real
5. **Mobile App**: Aplicativo nativo
6. **Pagamentos**: Integração com gateway de pagamento

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 **Equipe**

- **Desenvolvimento**: Nelson
- **Framework**: Django + React
- **Deploy**: Docker

---

**🎓 Trade Site** - Conectando estudantes através da troca de conhecimento!
