# Configuração para Desenvolvimento - Sem Autenticação

## 🔧 Mudanças Realizadas

### 1. **settings.py - REST_FRAMEWORK**
```python
REST_FRAMEWORK = {
    # Configurações para desenvolvimento - SEM AUTENTICAÇÃO
    # 'DEFAULT_AUTHENTICATION_CLASSES': [
    #     'rest_framework.authentication.TokenAuthentication',
    #     'rest_framework.authentication.SessionAuthentication',
    # ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',  # Permite acesso sem autenticação
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10
}
```

### 2. **users/views.py - UserViewSet**
- ✅ Removidas todas as permissões
- ✅ Comentado método `get_permissions()`
- ✅ Endpoint `/api/users/me/` retorna primeiro usuário se não autenticado

### 3. **items/views.py - ItemViewSet**
- ✅ Removidas permissões `IsAuthenticatedOrReadOnly` e `IsOwnerOrReadOnly`
- ✅ Comentada classe `IsOwnerOrReadOnly`
- ✅ `perform_create()` usa primeiro usuário disponível se não autenticado
- ✅ `get_queryset()` retorna todos os itens (sem filtro por status)

### 4. **offers/views.py - OfferViewSet**
- ✅ Removidas permissões `IsAuthenticated` e `IsOffererOrOwner`
- ✅ Comentada classe `IsOffererOrOwner`
- ✅ `perform_create()` usa primeiro usuário disponível se não autenticado
- ✅ Comentada validação de não oferecer pelo próprio item
- ✅ `get_queryset()` retorna todas as ofertas (sem filtro por usuário)
- ✅ Actions `accept()` e `refuse()` sem verificação de permissão

### 5. **auth_app/views.py - RegisterView**
- ✅ Já estava configurado com `AllowAny`

## 🚀 Como Testar

### Endpoints Disponíveis (sem autenticação):

#### **Usuários**
- `GET /api/users/` - Lista todos os usuários
- `GET /api/users/{id}/` - Detalhes de um usuário
- `GET /api/users/me/` - Retorna primeiro usuário disponível

#### **Itens**
- `GET /api/items/` - Lista todos os itens
- `POST /api/items/` - Cria novo item (usa primeiro usuário como owner)
- `GET /api/items/{id}/` - Detalhes de um item
- `PUT /api/items/{id}/` - Atualiza item
- `DELETE /api/items/{id}/` - Remove item

#### **Ofertas**
- `GET /api/offers/` - Lista todas as ofertas
- `POST /api/offers/` - Cria nova oferta (usa primeiro usuário como offerer)
- `GET /api/offers/{id}/` - Detalhes de uma oferta
- `PUT /api/offers/{id}/` - Atualiza oferta
- `DELETE /api/offers/{id}/` - Remove oferta
- `POST /api/offers/{id}/accept/` - Aceita oferta
- `POST /api/offers/{id}/refuse/` - Recusa oferta

#### **Registro**
- `POST /api/auth/register/` - Registra novo usuário

## 📝 Exemplos de Uso

### Criar um Item
```bash
curl -X POST http://localhost:8000/api/items/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Meu Item",
    "description": "Descrição do item",
    "status": "disponivel"
  }'
```

### Criar uma Oferta
```bash
curl -X POST http://localhost:8000/api/offers/ \
  -H "Content-Type: application/json" \
  -d '{
    "item_desired": 1,
    "item_offered": 2,
    "status": "pendente"
  }'
```

### Listar Todos os Itens
```bash
curl http://localhost:8000/api/items/
```

## ⚠️ Importante

- **Esta configuração é APENAS para desenvolvimento**
- **NÃO use em produção sem restaurar as permissões**
- **Todas as operações são permitidas sem autenticação**
- **O sistema cria automaticamente um usuário padrão se necessário**

## 🔄 Para Restaurar as Permissões

Quando quiser voltar ao modo de produção, descomente as linhas marcadas com `# DESENVOLVIMENTO:` e restaure as configurações originais.
