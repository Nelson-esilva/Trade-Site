# 📚 Índice da Documentação - Trade Site

## 🎯 Navegação Rápida

### 📖 Documentação Principal
- **[📋 Documentação Completa](DOCUMENTATION.md)** - Visão geral completa do projeto
- **[🔌 API Documentation](API_DOCUMENTATION.md)** - Documentação detalhada da API REST
- **[⚛️ Frontend Documentation](FRONTEND_DOCUMENTATION.md)** - Documentação do React
- **[🔧 Backend Documentation](BACKEND_DOCUMENTATION.md)** - Documentação do Django

### 🐳 Deploy e Infraestrutura
- **[🐳 Docker Setup](DOCKER_SETUP.md)** - Configuração e uso do Docker

---

## 📋 Por Onde Começar?

### 🚀 Para Iniciantes
1. **[📋 Documentação Completa](DOCUMENTATION.md)** - Comece aqui para entender o projeto
2. **[🐳 Docker Setup](DOCKER_SETUP.md)** - Configure o ambiente de desenvolvimento
3. **[🔌 API Documentation](API_DOCUMENTATION.md)** - Entenda como a API funciona

### 👨‍💻 Para Desenvolvedores
1. **[🔧 Backend Documentation](BACKEND_DOCUMENTATION.md)** - Estrutura e código do Django
2. **[⚛️ Frontend Documentation](FRONTEND_DOCUMENTATION.md)** - Estrutura e código do React
3. **[🔌 API Documentation](API_DOCUMENTATION.md)** - Endpoints e exemplos de uso

### 🚀 Para Deploy
1. **[🐳 Docker Setup](DOCKER_SETUP.md)** - Deploy com Docker
2. **[📋 Documentação Completa](DOCUMENTATION.md)** - Seção de deploy

---

## 📚 Estrutura da Documentação

### 📋 Documentação Completa (DOCUMENTATION.md)
- Visão geral do projeto
- Arquitetura e stack tecnológica
- Configuração e instalação
- Funcionalidades implementadas
- Estrutura de arquivos
- Próximos passos

### 🔌 API Documentation (API_DOCUMENTATION.md)
- Endpoints de autenticação
- Endpoints de itens
- Endpoints de ofertas
- Endpoints de usuários
- Códigos de status HTTP
- Exemplos de uso com curl e JavaScript

### ⚛️ Frontend Documentation (FRONTEND_DOCUMENTATION.md)
- Estrutura do projeto React
- Context API e gerenciamento de estado
- Componentes e páginas
- Serviços e comunicação com API
- Roteamento e autenticação
- Estilização com Material-UI

### 🔧 Backend Documentation (BACKEND_DOCUMENTATION.md)
- Estrutura do projeto Django
- Models e relacionamentos
- Serializers e validação
- Views e ViewSets
- Sistema de permissões
- Configuração e deploy

### 🐳 Docker Setup (DOCKER_SETUP.md)
- Configuração do Docker
- Comandos úteis
- Troubleshooting
- Deploy em produção

---

## 🔍 Busca Rápida por Tópico

### 🔐 Autenticação
- **[API Documentation](API_DOCUMENTATION.md#-endpoints-de-autenticação)** - Endpoints de login/registro
- **[Backend Documentation](BACKEND_DOCUMENTATION.md#-autenticação)** - Implementação no Django
- **[Frontend Documentation](FRONTEND_DOCUMENTATION.md#-autenticação)** - Implementação no React

### 📦 Itens
- **[API Documentation](API_DOCUMENTATION.md#-endpoints-de-itens)** - CRUD de itens
- **[Backend Documentation](BACKEND_DOCUMENTATION.md#item-model-itemsmodelspy)** - Modelo de Item
- **[Frontend Documentation](FRONTEND_DOCUMENTATION.md#homejsx)** - Página de listagem

### 💰 Ofertas
- **[API Documentation](API_DOCUMENTATION.md#-endpoints-de-ofertas)** - Sistema de ofertas
- **[Backend Documentation](BACKEND_DOCUMENTATION.md#offer-model-offersmodelspy)** - Modelo de Oferta
- **[Frontend Documentation](FRONTEND_DOCUMENTATION.md#myoffersjsx)** - Gerenciamento de ofertas

### 🔐 Permissões
- **[Backend Documentation](BACKEND_DOCUMENTATION.md#-permissões)** - Sistema de permissões
- **[API Documentation](API_DOCUMENTATION.md#-códigos-de-status)** - Códigos de erro

### 🐳 Docker
- **[Docker Setup](DOCKER_SETUP.md)** - Configuração completa
- **[Documentação Completa](DOCUMENTATION.md#-deploy-com-docker)** - Deploy geral

---

## 🛠️ Comandos Úteis

### 🚀 Início Rápido
```bash
# Iniciar aplicação
./start.sh

# Parar aplicação
./stop.sh

# Ver logs
docker compose logs -f
```

### 🔧 Desenvolvimento
```bash
# Backend
cd backend
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

# Frontend
cd frontend
npm install
npm start
```

### 🧪 Testes
```bash
# Backend
python manage.py test

# Frontend
npm test
```

---

## 📞 Suporte

### 🆘 Problemas Comuns
1. **Docker não inicia**: Verifique se Docker está rodando
2. **Porta ocupada**: Pare outros serviços nas portas 3000/8000
3. **Erro de migração**: Execute `python manage.py migrate`
4. **Dependências**: Execute `npm install` ou `pip install -r requirements.txt`

### 📚 Recursos Adicionais
- **[Docker Documentation](https://docs.docker.com/)**
- **[Django Documentation](https://docs.djangoproject.com/)**
- **[React Documentation](https://reactjs.org/docs/)**
- **[Material-UI Documentation](https://mui.com/)**

---

**📚 Documentação organizada para facilitar o desenvolvimento e manutenção do Trade Site**
