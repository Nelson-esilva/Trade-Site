# 🔌 API Documentation - Trade Site

## 📋 Índice

1. [Visão Geral](#-visão-geral)
2. [Autenticação](#-autenticação)
3. [Endpoints de Autenticação](#-endpoints-de-autenticação)
4. [Endpoints de Itens](#-endpoints-de-itens)
5. [Endpoints de Ofertas](#-endpoints-de-ofertas)
6. [Endpoints de Usuários](#-endpoints-de-usuários)
7. [Códigos de Status](#-códigos-de-status)
8. [Exemplos de Uso](#-exemplos-de-uso)

---

## 🎯 Visão Geral

A API do Trade Site é baseada em REST e utiliza Django REST Framework. Todas as respostas são em formato JSON.

**Base URL:** `http://localhost:8000/api`

**Content-Type:** `application/json`

---

## 🔐 Autenticação

A API utiliza **Token Authentication**. Para autenticar, inclua o token no header:

```
Authorization: Token <seu_token_aqui>
```

### Como obter um token:

1. **Login:** `POST /api/auth/login/`
2. **Registro:** `POST /api/auth/register/`

---

## 🔑 Endpoints de Autenticação

### POST /api/auth/login/

Autentica um usuário e retorna um token.

**Request:**
```json
{
  "username": "usuario123",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "username": "usuario123",
    "email": "usuario@email.com",
    "name": "Nome do Usuário",
    "is_trade_admin": false,
    "is_superuser": false
  },
  "token": "abc123def456ghi789"
}
```

**Response (401):**
```json
{
  "error": "Credenciais inválidas"
}
```

### POST /api/auth/register/

Registra um novo usuário e retorna um token.

**Request:**
```json
{
  "username": "novousuario",
  "email": "novo@email.com",
  "name": "Nome Completo",
  "password": "senha123",
  "confirmPassword": "senha123"
}
```

**Response (201):**
```json
{
  "user": {
    "id": 2,
    "username": "novousuario",
    "email": "novo@email.com",
    "name": "Nome Completo"
  },
  "token": "xyz789abc123def456"
}
```

**Response (400):**
```json
{
  "password": ["Password fields didn't match."]
}
```

---

## 📦 Endpoints de Itens

### GET /api/items/

Lista todos os itens disponíveis.

**Headers:**
```
Authorization: Token <token> (opcional)
```

**Query Parameters:**
- `category`: Filtrar por categoria (`livros`, `apostilas`, `equipamentos`, `tecnologia`)
- `status`: Filtrar por status (`disponivel`, `indisponível`, `trocado`)
- `search`: Buscar por título ou descrição
- `ordering`: Ordenar por campo (`created_at`, `title`, `-created_at`, `-title`)

**Response (200):**
```json
{
  "count": 25,
  "next": "http://localhost:8000/api/items/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Livro de Cálculo",
      "description": "Livro de cálculo diferencial e integral",
      "category": "livros",
      "location": "São Paulo, SP",
      "address": "Rua das Flores, 123",
      "image_url": "https://example.com/image.jpg",
      "owner": "usuario123",
      "status": "disponivel",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### POST /api/items/

Cria um novo item.

**Headers:**
```
Authorization: Token <token>
Content-Type: application/json
```

**Request:**
```json
{
  "title": "Novo Item",
  "description": "Descrição do item",
  "category": "livros",
  "location": "São Paulo, SP",
  "address": "Rua das Flores, 123",
  "image_url": "https://example.com/image.jpg",
  "status": "disponivel"
}
```

**Response (201):**
```json
{
  "id": 26,
  "title": "Novo Item",
  "description": "Descrição do item",
  "category": "livros",
  "location": "São Paulo, SP",
  "address": "Rua das Flores, 123",
  "image_url": "https://example.com/image.jpg",
  "owner": "usuario123",
  "status": "disponivel",
  "created_at": "2024-01-15T11:00:00Z",
  "updated_at": "2024-01-15T11:00:00Z"
}
```

### GET /api/items/{id}/

Obtém detalhes de um item específico.

**Headers:**
```
Authorization: Token <token> (opcional)
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Livro de Cálculo",
  "description": "Livro de cálculo diferencial e integral",
  "category": "livros",
  "location": "São Paulo, SP",
  "address": "Rua das Flores, 123",
  "image_url": "https://example.com/image.jpg",
  "owner": "usuario123",
  "status": "disponivel",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### PUT /api/items/{id}/

Atualiza um item existente.

**Headers:**
```
Authorization: Token <token>
Content-Type: application/json
```

**Request:**
```json
{
  "title": "Título Atualizado",
  "description": "Nova descrição",
  "category": "apostilas",
  "location": "Rio de Janeiro, RJ",
  "address": "Av. Copacabana, 456",
  "image_url": "https://example.com/new-image.jpg",
  "status": "disponivel"
}
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Título Atualizado",
  "description": "Nova descrição",
  "category": "apostilas",
  "location": "Rio de Janeiro, RJ",
  "address": "Av. Copacabana, 456",
  "image_url": "https://example.com/new-image.jpg",
  "owner": "usuario123",
  "status": "disponivel",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T12:00:00Z"
}
```

### DELETE /api/items/{id}/

Exclui um item.

**Headers:**
```
Authorization: Token <token>
```

**Response (204):** No Content

### PATCH /api/items/{id}/change_status/

Altera o status de um item.

**Headers:**
```
Authorization: Token <token>
Content-Type: application/json
```

**Request:**
```json
{
  "status": "indisponível"
}
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Livro de Cálculo",
  "description": "Livro de cálculo diferencial e integral",
  "category": "livros",
  "location": "São Paulo, SP",
  "address": "Rua das Flores, 123",
  "image_url": "https://example.com/image.jpg",
  "owner": "usuario123",
  "status": "indisponível",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T12:30:00Z"
}
```

---

## 💰 Endpoints de Ofertas

### GET /api/offers/

Lista ofertas do usuário autenticado.

**Headers:**
```
Authorization: Token <token>
```

**Response (200):**
```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "item_desired": 5,
      "item_offered": 3,
      "offerer": "usuario123",
      "offer_type": "item",
      "money_amount": null,
      "status": "pendente",
      "created_at": "2024-01-15T14:00:00Z",
      "item_desired_data": {
        "id": 5,
        "title": "Livro de Física",
        "description": "Livro de física moderna",
        "category": "livros",
        "location": "São Paulo, SP",
        "address": "Rua das Flores, 123",
        "image_url": "https://example.com/physics.jpg",
        "owner": "outrousuario",
        "status": "disponivel",
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
      },
      "item_offered_data": {
        "id": 3,
        "title": "Livro de Química",
        "description": "Livro de química orgânica",
        "category": "livros",
        "location": "São Paulo, SP",
        "address": "Rua das Flores, 123",
        "image_url": "https://example.com/chemistry.jpg",
        "owner": "usuario123",
        "status": "disponivel",
        "created_at": "2024-01-15T09:00:00Z",
        "updated_at": "2024-01-15T09:00:00Z"
      }
    }
  ]
}
```

### POST /api/offers/

Cria uma nova oferta.

**Headers:**
```
Authorization: Token <token>
Content-Type: application/json
```

**Request (Oferta de Item):**
```json
{
  "item_desired": 5,
  "item_offered": 3,
  "offer_type": "item"
}
```

**Request (Oferta em Dinheiro):**
```json
{
  "item_desired": 5,
  "offer_type": "money",
  "money_amount": "50.00"
}
```

**Response (201):**
```json
{
  "id": 2,
  "item_desired": 5,
  "item_offered": 3,
  "offerer": "usuario123",
  "offer_type": "item",
  "money_amount": null,
  "status": "pendente",
  "created_at": "2024-01-15T15:00:00Z",
  "item_desired_data": {
    "id": 5,
    "title": "Livro de Física",
    "description": "Livro de física moderna",
    "category": "livros",
    "location": "São Paulo, SP",
    "address": "Rua das Flores, 123",
    "image_url": "https://example.com/physics.jpg",
    "owner": "outrousuario",
    "status": "disponivel",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  },
  "item_offered_data": {
    "id": 3,
    "title": "Livro de Química",
    "description": "Livro de química orgânica",
    "category": "livros",
    "location": "São Paulo, SP",
    "address": "Rua das Flores, 123",
    "image_url": "https://example.com/chemistry.jpg",
    "owner": "usuario123",
    "status": "disponivel",
    "created_at": "2024-01-15T09:00:00Z",
    "updated_at": "2024-01-15T09:00:00Z"
  }
}
```

### GET /api/offers/{id}/

Obtém detalhes de uma oferta específica.

**Headers:**
```
Authorization: Token <token>
```

**Response (200):**
```json
{
  "id": 1,
  "item_desired": 5,
  "item_offered": 3,
  "offerer": "usuario123",
  "offer_type": "item",
  "money_amount": null,
  "status": "pendente",
  "created_at": "2024-01-15T14:00:00Z",
  "item_desired_data": {
    "id": 5,
    "title": "Livro de Física",
    "description": "Livro de física moderna",
    "category": "livros",
    "location": "São Paulo, SP",
    "address": "Rua das Flores, 123",
    "image_url": "https://example.com/physics.jpg",
    "owner": "outrousuario",
    "status": "disponivel",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  },
  "item_offered_data": {
    "id": 3,
    "title": "Livro de Química",
    "description": "Livro de química orgânica",
    "category": "livros",
    "location": "São Paulo, SP",
    "address": "Rua das Flores, 123",
    "image_url": "https://example.com/chemistry.jpg",
    "owner": "usuario123",
    "status": "disponivel",
    "created_at": "2024-01-15T09:00:00Z",
    "updated_at": "2024-01-15T09:00:00Z"
  }
}
```

### POST /api/offers/{id}/accept/

Aceita uma oferta.

**Headers:**
```
Authorization: Token <token>
```

**Response (200):**
```json
{
  "id": 1,
  "item_desired": 5,
  "item_offered": 3,
  "offerer": "usuario123",
  "offer_type": "item",
  "money_amount": null,
  "status": "aceita",
  "created_at": "2024-01-15T14:00:00Z",
  "item_desired_data": {
    "id": 5,
    "title": "Livro de Física",
    "description": "Livro de física moderna",
    "category": "livros",
    "location": "São Paulo, SP",
    "address": "Rua das Flores, 123",
    "image_url": "https://example.com/physics.jpg",
    "owner": "outrousuario",
    "status": "indisponível",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T16:00:00Z"
  },
  "item_offered_data": {
    "id": 3,
    "title": "Livro de Química",
    "description": "Livro de química orgânica",
    "category": "livros",
    "location": "São Paulo, SP",
    "address": "Rua das Flores, 123",
    "image_url": "https://example.com/chemistry.jpg",
    "owner": "usuario123",
    "status": "indisponível",
    "created_at": "2024-01-15T09:00:00Z",
    "updated_at": "2024-01-15T16:00:00Z"
  }
}
```

### POST /api/offers/{id}/refuse/

Recusa uma oferta.

**Headers:**
```
Authorization: Token <token>
```

**Response (200):**
```json
{
  "id": 1,
  "item_desired": 5,
  "item_offered": 3,
  "offerer": "usuario123",
  "offer_type": "item",
  "money_amount": null,
  "status": "recusada",
  "created_at": "2024-01-15T14:00:00Z",
  "item_desired_data": {
    "id": 5,
    "title": "Livro de Física",
    "description": "Livro de física moderna",
    "category": "livros",
    "location": "São Paulo, SP",
    "address": "Rua das Flores, 123",
    "image_url": "https://example.com/physics.jpg",
    "owner": "outrousuario",
    "status": "disponivel",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  },
  "item_offered_data": {
    "id": 3,
    "title": "Livro de Química",
    "description": "Livro de química orgânica",
    "category": "livros",
    "location": "São Paulo, SP",
    "address": "Rua das Flores, 123",
    "image_url": "https://example.com/chemistry.jpg",
    "owner": "usuario123",
    "status": "disponivel",
    "created_at": "2024-01-15T09:00:00Z",
    "updated_at": "2024-01-15T09:00:00Z"
  }
}
```

---

## 👥 Endpoints de Usuários

### GET /api/users/

Lista todos os usuários (apenas para administradores).

**Headers:**
```
Authorization: Token <token>
```

**Response (200):**
```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "username": "usuario123",
      "email": "usuario@email.com",
      "name": "Nome do Usuário",
      "is_trade_admin": false,
      "is_superuser": false,
      "date_joined": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### GET /api/users/me/

Obtém dados do usuário autenticado.

**Headers:**
```
Authorization: Token <token>
```

**Response (200):**
```json
{
  "id": 1,
  "username": "usuario123",
  "email": "usuario@email.com",
  "name": "Nome do Usuário",
  "is_trade_admin": false,
  "is_superuser": false,
  "date_joined": "2024-01-15T10:00:00Z"
}
```

### GET /api/users/{id}/

Obtém dados de um usuário específico.

**Headers:**
```
Authorization: Token <token>
```

**Response (200):**
```json
{
  "id": 2,
  "username": "outrousuario",
  "email": "outro@email.com",
  "name": "Outro Usuário",
  "is_trade_admin": false,
  "is_superuser": false,
  "date_joined": "2024-01-15T11:00:00Z"
}
```

---

## 📊 Códigos de Status

### Sucesso
- **200 OK** - Requisição bem-sucedida
- **201 Created** - Recurso criado com sucesso
- **204 No Content** - Requisição bem-sucedida, sem conteúdo

### Erro do Cliente
- **400 Bad Request** - Dados inválidos
- **401 Unauthorized** - Não autenticado
- **403 Forbidden** - Sem permissão
- **404 Not Found** - Recurso não encontrado
- **405 Method Not Allowed** - Método não permitido

### Erro do Servidor
- **500 Internal Server Error** - Erro interno do servidor

---

## 💡 Exemplos de Uso

### Exemplo 1: Login e Listagem de Itens

```javascript
// 1. Fazer login
const loginResponse = await fetch('http://localhost:8000/api/auth/login/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'usuario123',
    password: 'senha123'
  })
});

const loginData = await loginResponse.json();
const token = loginData.token;

// 2. Listar itens
const itemsResponse = await fetch('http://localhost:8000/api/items/', {
  headers: {
    'Authorization': `Token ${token}`
  }
});

const itemsData = await itemsResponse.json();
console.log(itemsData.results);
```

### Exemplo 2: Criar Item e Fazer Oferta

```javascript
// 1. Criar item
const createItemResponse = await fetch('http://localhost:8000/api/items/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`
  },
  body: JSON.stringify({
    title: 'Meu Livro',
    description: 'Livro de matemática',
    category: 'livros',
    location: 'São Paulo, SP',
    address: 'Rua das Flores, 123',
    status: 'disponivel'
  })
});

const newItem = await createItemResponse.json();

// 2. Fazer oferta
const createOfferResponse = await fetch('http://localhost:8000/api/offers/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`
  },
  body: JSON.stringify({
    item_desired: 5,
    item_offered: newItem.id,
    offer_type: 'item'
  })
});

const newOffer = await createOfferResponse.json();
```

### Exemplo 3: Aceitar Oferta

```javascript
const acceptOfferResponse = await fetch('http://localhost:8000/api/offers/1/accept/', {
  method: 'POST',
  headers: {
    'Authorization': `Token ${token}`
  }
});

const acceptedOffer = await acceptOfferResponse.json();
```

---

## 🔧 Configuração de Desenvolvimento

### Variáveis de Ambiente

```env
# Backend
SECRET_KEY=django-insecure-...
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Testando a API

```bash
# Usando curl
curl -X GET http://localhost:8000/api/items/ \
  -H "Authorization: Token abc123def456ghi789"

# Usando Python requests
import requests

headers = {'Authorization': 'Token abc123def456ghi789'}
response = requests.get('http://localhost:8000/api/items/', headers=headers)
print(response.json())
```

---

**Documentação da API atualizada em: Janeiro 2024**
