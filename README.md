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
- **Autenticação**: Sistema customizado (desenvolvimento)
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
├── docker-compose.yml      # Orquestração Docker
├── start.sh               # Script de inicialização
└── stop.sh                # Script de parada
```

## 🔧 **Funcionalidades**

### **✅ Implementadas**
- **Gestão de Itens**: Criar, listar, visualizar itens
- **Sistema de Ofertas**: Fazer, aceitar, recusar ofertas
- **Busca e Filtros**: Buscar itens por texto e categoria
- **Interface Responsiva**: Design adaptável para mobile
- **Autenticação**: Sistema de login/registro
- **API RESTful**: Endpoints completos para todas as operações

### **🔄 Em Desenvolvimento**
- Upload de imagens
- Sistema de mensagens
- Notificações em tempo real
- Geolocalização
- Sistema de avaliações

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

## 📚 **Documentação**

- [Configuração Docker](DOCKER_SETUP.md)
- [Backend - Configuração Docker](backend/DOCKER_README.md)
- [Frontend - Refatoração](frontend/FRONTEND_REFACTOR.md)
- [Configuração de Desenvolvimento](backend/DEVELOPMENT_CONFIG.md)

## 🎯 **Próximos Passos**

1. **Autenticação Real**: Implementar JWT
2. **Upload de Imagens**: Sistema de upload de fotos
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
