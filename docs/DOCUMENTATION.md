# 📚 Documentação Completa - Trade Site

> Última atualização: 20/03/2026

## 📋 Índice

1. [Visão Geral](#-visão-geral)
2. [Arquitetura](#-arquitetura)
3. [Backend (Django)](#-backend-django)
4. [Frontend (React)](#-frontend-react)
5. [Banco de Dados](#-banco-de-dados)
6. [API Endpoints](#-api-endpoints)
7. [Autenticação e Permissões](#-autenticação-e-permissões)
8. [Deploy com Docker](#-deploy-com-docker)
9. [Desenvolvimento Local](#-desenvolvimento-local)
10. [Funcionalidades](#-funcionalidades)
11. [Estrutura de Arquivos](#-estrutura-de-arquivos)

---

## 🎯 Visão Geral

O **Trade Site** é uma aplicação web para troca de itens acadêmicos (livros, apostilas, equipamentos, tecnologia) entre estudantes. A aplicação permite que usuários cadastrem itens, façam ofertas de troca e gerenciem suas transações.

### 🎨 Características Principais

- **Sistema de Troca**: Usuários podem trocar itens entre si
- **Ofertas em Dinheiro**: Possibilidade de fazer ofertas monetárias
- **Sistema de Permissões**: Administradores com controle total
- **Interface Responsiva**: Design moderno com Material-UI
- **Autenticação Segura**: JWT (access + refresh token)

### 🆕 Atualizações de Hoje (20/03/2026)

- Fluxo de autenticação reforçado e correções de navegação pós-cadastro.
- Integração de storage com Cloudinary (opcional por variável de ambiente).
- Endpoints de health check para deploy (`/` e `/healthz/`).
- Correção de paginação de ofertas com ordenação explícita.
- Novas regras de negócio:
  - usuário não pode ofertar no próprio item;
  - usuário pode cancelar oferta pendente enviada.
- Reforma visual do frontend e refinamento de UX/UI.
- Redesign do formulário de cadastro de item para layout centralizado e mais consistente.

---

## 🏗️ Arquitetura

### Stack Tecnológica

**Backend:**
- Django 4.x
- Django REST Framework
- PostgreSQL (produção) / SQLite (desenvolvimento)
- Docker & Docker Compose

**Frontend:**
- React 18
- Material-UI (MUI)
- React Router
- Context API para gerenciamento de estado

**Infraestrutura:**
- Docker & Docker Compose
- Nginx (proxy reverso)
- Gunicorn (servidor WSGI)

### Diagrama de Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Django)      │◄──►│   (PostgreSQL)  │
│   Port: 3000    │    │   Port: 8000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🔧 Backend (Django)

### Configuração

O backend está localizado na pasta `backend/` e utiliza Django 4.x com Django REST Framework.

#### Estrutura de Apps

```
backend/
├── core/                 # Configurações principais
├── users/               # Gerenciamento de usuários
├── items/               # Gerenciamento de itens
├── offers/              # Sistema de ofertas
└── auth_app/            # Autenticação
```

### Models

#### User Model (users/models.py)
```python
class User(AbstractUser):
    name = models.CharField(max_length=255, blank=False, null=False)
    is_trade_admin = models.BooleanField(default=False)
```

#### Item Model (items/models.py)
```python
class Item(models.Model):
    STATUS_CHOICES = [
        ('disponivel', 'Disponível'),
        ('indisponível', 'Indisponível'),
        ('trocado', 'Trocado'),
    ]
    
    CATEGORY_CHOICES = [
        ('livros', 'Livros'),
        ('apostilas', 'Apostilas'),
        ('equipamentos', 'Equipamentos'),
        ('tecnologia', 'Tecnologia'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    location = models.CharField(max_length=255, default="Não informado")
    address = models.TextField(default="Não informado")
    image_url = models.URLField(blank=True, null=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=255, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

#### Offer Model (offers/models.py)
```python
class Offer(models.Model):
    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('aceita', 'Aceita'),
        ('recusada', 'Recusada'),
        ('trocado', 'Trocado'),
    ]
    
    OFFER_TYPE_CHOICES = [
        ('item', 'Item'),
        ('money', 'Dinheiro'),
    ]
    
    item_desired = models.ForeignKey(Item, on_delete=models.CASCADE)
    item_offered = models.ForeignKey(Item, on_delete=models.CASCADE, null=True, blank=True)
    offerer = models.ForeignKey(User, on_delete=models.CASCADE)
    offer_type = models.CharField(max_length=10, choices=OFFER_TYPE_CHOICES)
    money_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
```

### Permissões Customizadas

#### IsOwnerOrTradeAdminOrReadOnly
```python
class IsOwnerOrTradeAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if hasattr(request.user, 'is_trade_admin') and request.user.is_trade_admin:
            return True
        if request.user.is_superuser:
            return True
        return obj.owner == request.user
```

### ViewSets

#### ItemViewSet (items/views.py)
- **GET** `/api/items/` - Lista itens (filtrado por status para usuários comuns)
- **POST** `/api/items/` - Cria novo item
- **GET** `/api/items/{id}/` - Detalhes do item
- **PUT/PATCH** `/api/items/{id}/` - Atualiza item
- **DELETE** `/api/items/{id}/` - Exclui item
- **PATCH** `/api/items/{id}/change_status/` - Altera status do item

#### OfferViewSet (offers/views.py)
- **GET** `/api/offers/` - Lista ofertas (filtrado por usuário)
- **POST** `/api/offers/` - Cria nova oferta
- **GET** `/api/offers/{id}/` - Detalhes da oferta
- **POST** `/api/offers/{id}/accept/` - Aceita oferta
- **POST** `/api/offers/{id}/refuse/` - Recusa oferta

---

## ⚛️ Frontend (React)

### Estrutura de Componentes

```
frontend/src/
├── components/          # Componentes reutilizáveis
│   ├── ItemCard.jsx    # Card de item
│   ├── Layout/         # Layout da aplicação
│   ├── ProtectedRoute.jsx
│   └── ProfileProtection.jsx
├── contexts/           # Context API
│   └── AppContext.jsx  # Estado global
├── pages/              # Páginas da aplicação
│   ├── Home.jsx
│   ├── auth/
│   ├── items/
│   └── offers/
├── services/           # Serviços
│   └── api.js         # Cliente API
└── theme.js           # Tema Material-UI
```

### Context API (AppContext.jsx)

O `AppContext` gerencia o estado global da aplicação:

```javascript
const AppContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  items: [],
  offers: [],
  loading: false,
  error: null,
  notifications: []
};
```

#### Principais Funções

- `loadItems()` - Carrega lista de itens
- `loadOffers()` - Carrega ofertas do usuário
- `createItem(itemData)` - Cria novo item
- `createOffer(offerData)` - Cria nova oferta
- `acceptOffer(id)` - Aceita oferta
- `refuseOffer(id)` - Recusa oferta
- `login(username, password)` - Autentica usuário
- `logout()` - Desautentica usuário

### Serviço API (services/api.js)

Cliente HTTP para comunicação com o backend:

```javascript
class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:8000/api';
  }
  
  async request(endpoint, options = {}) {
    // Implementação da requisição HTTP
  }
  
  // Métodos CRUD para itens
  async getItems() { return this.get('/items/'); }
  async getItem(id) { return this.get(`/items/${id}/`); }
  async createItem(itemData) { return this.post('/items/', itemData); }
  async updateItem(id, itemData) { return this.put(`/items/${id}/`, itemData); }
  async deleteItem(id) { return this.delete(`/items/${id}/`); }
  
  // Métodos para ofertas
  async getOffers() { return this.get('/offers/'); }
  async createOffer(offerData) { return this.post('/offers/', offerData); }
  async acceptOffer(id) { return this.post(`/offers/${id}/accept/`); }
  async refuseOffer(id) { return this.post(`/offers/${id}/refuse/`); }
}
```

### Páginas Principais

#### Home.jsx
- Exibe lista de itens disponíveis
- Filtros por categoria
- Busca por título/descrição
- Cards responsivos com Material-UI

#### ItemDetails.jsx
- Detalhes completos do item
- Formulário para fazer ofertas
- Botões de ação para administradores
- Suporte a ofertas em dinheiro

#### MyItems.jsx
- Lista itens do usuário logado
- Opções de edição e exclusão
- Edição de imagens
- Filtros por status

#### MyOffers.jsx
- Ofertas enviadas e recebidas
- Histórico de ofertas
- Ações de aceitar/recusar
- Filtros por status

---

## 🗄️ Banco de Dados

### Configuração

**Desenvolvimento:** SQLite
**Produção:** PostgreSQL

### Migrações

```bash
# Criar migrações
python manage.py makemigrations

# Aplicar migrações
python manage.py migrate
```

### Relacionamentos

```
User (1) ──► (N) Item
User (1) ──► (N) Offer
Item (1) ──► (N) Offer (item_desired)
Item (1) ──► (N) Offer (item_offered)
```

---

## 🔌 API Endpoints

### Autenticação
- `POST /api/auth/login/` - Login
- `POST /api/auth/register/` - Registro

### Itens
- `GET /api/items/` - Lista itens
- `POST /api/items/` - Cria item
- `GET /api/items/{id}/` - Detalhes do item
- `PUT /api/items/{id}/` - Atualiza item
- `DELETE /api/items/{id}/` - Exclui item
- `PATCH /api/items/{id}/change_status/` - Altera status

### Ofertas
- `GET /api/offers/` - Lista ofertas
- `POST /api/offers/` - Cria oferta
- `GET /api/offers/{id}/` - Detalhes da oferta
- `POST /api/offers/{id}/accept/` - Aceita oferta
- `POST /api/offers/{id}/refuse/` - Recusa oferta
- `POST /api/offers/{id}/cancel/` - Cancela oferta pendente (ofertante/admin)

### Usuários
- `GET /api/users/` - Lista usuários (admin)
- `GET /api/users/me/` - Dados do usuário atual
- `GET /api/users/{id}/` - Detalhes do usuário

---

## 🔐 Autenticação e Permissões

### Sistema de Tokens

- **JWT Authentication** para API
- **Session Authentication** para admin
- Access/refresh token armazenados no frontend

### Níveis de Permissão

1. **Usuário Não Autenticado**
   - Visualizar itens disponíveis
   - Acessar páginas públicas

2. **Usuário Comum**
   - Criar/editar próprios itens
   - Fazer ofertas
   - Gerenciar próprias ofertas

3. **Trade Admin** (`is_trade_admin=True`)
   - Todas as permissões de usuário comum
   - Alterar status de qualquer item
   - Aceitar/recusar ofertas de qualquer item

4. **Superusuário**
   - Controle total do sistema
   - Excluir qualquer item
   - Gerenciar usuários

### Proteção de Rotas

```javascript
// Rota protegida
<Route path="/profile" element={
  <ProtectedRoute>
    <Profile />
  </ProtectedRoute>
} />

// Rota pública
<Route path="/" element={
  <ProtectedRoute requireAuth={false}>
    <Home />
  </ProtectedRoute>
} />
```

---

## 🐳 Deploy com Docker

### Estrutura Docker

```
├── docker-compose.yml      # Orquestração principal
├── backend/
│   ├── Dockerfile         # Imagem do backend
│   └── docker-compose.yml # Configuração do backend
└── frontend/
    ├── Dockerfile         # Imagem do frontend
    └── docker-compose.yml # Configuração do frontend
```

### Comandos Docker

```bash
# Iniciar aplicação
./start.sh

# Parar aplicação
./stop.sh

# Ver logs
docker compose logs -f

# Rebuild
docker compose up --build -d
```

### Variáveis de Ambiente

```env
# Backend
SECRET_KEY=django-insecure-...
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgresql://user:password@db:5432/tradesite
SITE_URL=http://localhost:8000
USE_CLOUDINARY=false
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Database
POSTGRES_DB=tradesite
POSTGRES_USER=user
POSTGRES_PASSWORD=password
```

### Deploy Render + Vercel (produção)

- **Render (backend)**:
  - definir health check para `/healthz/`;
  - configurar `USE_CLOUDINARY=true` e credenciais Cloudinary;
  - configurar `SITE_URL` com URL pública do backend.
- **Vercel (frontend)**:
  - garantir variável de URL da API apontando para o backend em produção;
  - fazer novo build/deploy após alterações de autenticação e formulário.

---

## 💻 Desenvolvimento Local

### Pré-requisitos

- Python 3.11+
- Node.js 18+
- Docker & Docker Compose

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm start
```

### URLs de Desenvolvimento

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8000
- **Admin:** http://localhost:8000/admin

---

## 🎯 Funcionalidades

### Para Usuários Comuns

1. **Cadastro e Login**
   - Registro com validação
   - Login com token
   - Perfil personalizado

2. **Gerenciamento de Itens**
   - Cadastrar itens com categoria, localização, imagem
   - Editar próprios itens
   - Excluir próprios itens
   - Visualizar histórico

3. **Sistema de Ofertas**
   - Fazer ofertas de troca
   - Fazer ofertas em dinheiro
   - Aceitar/recusar ofertas recebidas
   - Visualizar histórico de ofertas

4. **Busca e Filtros**
   - Buscar por título/descrição
   - Filtrar por categoria
   - Ordenar por data

### Para Administradores

1. **Controle Total**
   - Alterar status de qualquer item
   - Aceitar/recusar ofertas de qualquer item
   - Excluir qualquer item
   - Gerenciar usuários

2. **Moderação**
   - Aprovar/rejeitar itens
   - Gerenciar disputas
   - Estatísticas do sistema

---

## 📁 Estrutura de Arquivos

```
Trade-Site/
├── backend/
│   ├── core/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── users/
│   │   ├── models.py
│   │   ├── views.py
│   │   └── serializers.py
│   ├── items/
│   │   ├── models.py
│   │   ├── views.py
│   │   └── serializers.py
│   ├── offers/
│   │   ├── models.py
│   │   ├── views.py
│   │   └── serializers.py
│   ├── auth_app/
│   │   ├── views.py
│   │   └── serializers.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── docker-compose.yml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── theme.js
│   ├── package.json
│   ├── Dockerfile
│   └── docker-compose.yml
├── docker-compose.yml
├── start.sh
├── stop.sh
└── README.md
```

---

## 🚀 Próximos Passos

### Melhorias Planejadas

1. **Notificações em Tempo Real**
   - WebSockets para notificações
   - Email notifications

2. **Sistema de Avaliações**
   - Rating de usuários
   - Comentários em transações

3. **Geolocalização**
   - Mapa de itens próximos
   - Filtros por distância

4. **Mobile App**
   - React Native
   - Push notifications

5. **Analytics**
   - Dashboard de estatísticas
   - Relatórios de uso

### Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique a documentação
2. Consulte os logs do Docker
3. Abra uma issue no repositório
4. Entre em contato com a equipe

---

**Desenvolvido com ❤️ para facilitar a troca de materiais acadêmicos**
