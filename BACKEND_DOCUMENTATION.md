# 🔧 Backend Documentation - Trade Site

## 📋 Índice

1. [Visão Geral](#-visão-geral)
2. [Estrutura do Projeto](#-estrutura-do-projeto)
3. [Configuração](#-configuração)
4. [Models](#-models)
5. [Serializers](#-serializers)
6. [Views](#-views)
7. [URLs](#-urls)
8. [Permissões](#-permissões)
9. [Filtros e Busca](#-filtros-e-busca)
10. [Autenticação](#-autenticação)
11. [Deploy](#-deploy)

---

## 🎯 Visão Geral

O backend do Trade Site é uma API REST desenvolvida em Django 4.x com Django REST Framework. A aplicação gerencia usuários, itens e ofertas de troca com um sistema robusto de permissões e autenticação.

### Características Principais

- **Django 4.x** com Django REST Framework
- **PostgreSQL** para produção, SQLite para desenvolvimento
- **Token Authentication** para API
- **Sistema de Permissões** granular
- **Filtros e Busca** avançados
- **Docker** para containerização

---

## 📁 Estrutura do Projeto

```
backend/
├── core/                 # Configurações principais
│   ├── __init__.py
│   ├── settings.py      # Configurações do Django
│   ├── urls.py          # URLs principais
│   ├── wsgi.py          # WSGI configuration
│   └── asgi.py          # ASGI configuration
├── users/               # Gerenciamento de usuários
│   ├── models.py        # Modelo de usuário customizado
│   ├── views.py         # Views de usuários
│   ├── serializers.py   # Serializers de usuários
│   ├── urls.py          # URLs de usuários
│   └── migrations/      # Migrações do banco
├── items/               # Gerenciamento de itens
│   ├── models.py        # Modelo de item
│   ├── views.py         # Views de itens
│   ├── serializers.py   # Serializers de itens
│   ├── urls.py          # URLs de itens
│   └── migrations/      # Migrações do banco
├── offers/              # Sistema de ofertas
│   ├── models.py        # Modelo de oferta
│   ├── views.py         # Views de ofertas
│   ├── serializers.py   # Serializers de ofertas
│   ├── urls.py          # URLs de ofertas
│   └── migrations/      # Migrações do banco
├── auth_app/            # Autenticação
│   ├── views.py         # Views de login/registro
│   ├── serializers.py   # Serializers de autenticação
│   └── urls.py          # URLs de autenticação
├── manage.py            # Script de gerenciamento
├── requirements.txt     # Dependências Python
├── Dockerfile          # Imagem Docker
└── docker-compose.yml  # Configuração Docker
```

---

## ⚙️ Configuração

### settings.py

```python
# Configurações principais
SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost').split(',')

# Aplicações instaladas
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'django_filters',
    'users',
    'items',
    'offers',
    'auth_app',
]

# Middleware
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Configuração do banco de dados
DATABASES = {
    'default': dj_database_url.config(
        default='sqlite:///db.sqlite3'
    )
}

# Configuração do Django REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

# Configuração CORS
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Configuração de arquivos estáticos
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```

### requirements.txt

```txt
Django>=4.0,<5.0
djangorestframework>=3.14.0
django-cors-headers>=4.0.0
django-filter>=23.0
Pillow>=10.0.0
psycopg2-binary>=2.9.0
python-decouple>=3.8
gunicorn>=21.0.0
dj-database-url>=2.0.0
```

---

## 🗄️ Models

### User Model (users/models.py)

```python
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    name = models.CharField(
        max_length=255,
        blank=False, 
        null=False,
        help_text="Nome completo do usuário"
    )
    is_trade_admin = models.BooleanField(
        default=False, 
        help_text="Designa se este usuário é um administrador do sistema de trocas"
    )
    
    def __str__(self):
        return self.username
```

**Campos:**
- `name`: Nome completo do usuário
- `is_trade_admin`: Flag para administradores de troca
- Herda todos os campos do `AbstractUser`

### Item Model (items/models.py)

```python
from django.db import models
from django.conf import settings

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

    title = models.CharField(
        max_length=255,
        help_text="Título do item"
    )
    description = models.TextField(
        help_text="Descrição detalhada do item"
    )
    category = models.CharField(
        max_length=50, 
        choices=CATEGORY_CHOICES, 
        default='livros',
        help_text="Categoria do item"
    )
    location = models.CharField(
        max_length=255, 
        default="Não informado",
        help_text="Cidade/Estado"
    )
    address = models.TextField(
        default="Não informado",
        help_text="Endereço completo"
    )
    image_url = models.URLField(
        blank=True, 
        null=True,
        help_text="URL da imagem do produto"
    )
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='items',
        help_text="Proprietário do item"
    )
    status = models.CharField(
        max_length=255, 
        choices=STATUS_CHOICES, 
        default='disponivel',
        help_text="Status atual do item"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Item'
        verbose_name_plural = 'Itens'

    def __str__(self):
        return self.title
```

**Campos:**
- `title`: Título do item
- `description`: Descrição detalhada
- `category`: Categoria (livros, apostilas, equipamentos, tecnologia)
- `location`: Localização (cidade/estado)
- `address`: Endereço completo
- `image_url`: URL da imagem
- `owner`: Proprietário do item
- `status`: Status atual (disponível, indisponível, trocado)
- `created_at`: Data de criação
- `updated_at`: Data de atualização

### Offer Model (offers/models.py)

```python
from django.db import models
from django.conf import settings
from items.models import Item

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

    item_desired = models.ForeignKey(
        Item, 
        on_delete=models.CASCADE, 
        related_name='offers_received',
        help_text="Item desejado"
    )
    item_offered = models.ForeignKey(
        Item, 
        on_delete=models.CASCADE, 
        related_name='offers_made', 
        null=True, 
        blank=True,
        help_text="Item oferecido (se oferta for de item)"
    )
    offerer = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='offers',
        help_text="Usuário que fez a oferta"
    )
    offer_type = models.CharField(
        max_length=10, 
        choices=OFFER_TYPE_CHOICES, 
        default='item',
        help_text="Tipo de oferta (item ou dinheiro)"
    )
    money_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True,
        help_text="Valor em dinheiro (se oferta for em dinheiro)"
    )
    status = models.CharField(
        max_length=10, 
        choices=STATUS_CHOICES, 
        default='pendente',
        help_text="Status da oferta"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Oferta'
        verbose_name_plural = 'Ofertas'

    def __str__(self):
        return f"Oferta de {self.offerer.username} por {self.item_desired.title}"
```

**Campos:**
- `item_desired`: Item desejado
- `item_offered`: Item oferecido (opcional)
- `offerer`: Usuário que fez a oferta
- `offer_type`: Tipo de oferta (item ou dinheiro)
- `money_amount`: Valor em dinheiro (opcional)
- `status`: Status da oferta
- `created_at`: Data de criação

---

## 📝 Serializers

### UserSerializer (users/serializers.py)

```python
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 
            'username', 
            'email', 
            'name', 
            'is_trade_admin', 
            'is_superuser',
            'date_joined'
        ]
        read_only_fields = ['id', 'date_joined']
```

### ItemSerializer (items/serializers.py)

```python
from rest_framework import serializers
from .models import Item

class ItemSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Item
        fields = [
            'id', 
            'title', 
            'description', 
            'category', 
            'location', 
            'address', 
            'image_url', 
            'owner', 
            'status', 
            'created_at', 
            'updated_at'
        ]
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']
```

### OfferSerializer (offers/serializers.py)

```python
from rest_framework import serializers
from .models import Offer
from items.serializers import ItemSerializer

class OfferSerializer(serializers.ModelSerializer):
    offerer = serializers.ReadOnlyField(source='offerer.username')
    item_desired_data = ItemSerializer(source='item_desired', read_only=True)
    item_offered_data = ItemSerializer(source='item_offered', read_only=True)

    class Meta:
        model = Offer
        fields = [
            'id', 
            'item_desired', 
            'item_offered', 
            'offerer', 
            'offer_type', 
            'money_amount', 
            'status', 
            'created_at', 
            'item_desired_data', 
            'item_offered_data'
        ]
        read_only_fields = ['id', 'offerer', 'status', 'created_at']

    def validate(self, data):
        """
        Validação customizada para garantir que:
        - Se offer_type for 'item', item_offered deve ser fornecido
        - Se offer_type for 'money', money_amount deve ser fornecido
        """
        offer_type = data.get('offer_type', 'item')
        
        if offer_type == 'item' and not data.get('item_offered'):
            raise serializers.ValidationError(
                "item_offered é obrigatório quando offer_type é 'item'"
            )
        
        if offer_type == 'money' and not data.get('money_amount'):
            raise serializers.ValidationError(
                "money_amount é obrigatório quando offer_type é 'money'"
            )
        
        return data
```

---

## 🎯 Views

### ItemViewSet (items/views.py)

```python
from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Item
from .serializers import ItemSerializer

class IsOwnerOrTradeAdminOrReadOnly(permissions.BasePermission):
    """
    Permissão que permite:
    - Leitura para todos (incluindo usuários não autenticados)
    - Escrita apenas para donos do item ou administradores
    """
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

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [IsOwnerOrTradeAdminOrReadOnly]
    
    # Filtros
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'status']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'title']
    ordering = ['-created_at']

    def get_queryset(self):
        """
        Filtra itens baseado no tipo de usuário:
        - Superusuários e administradores: veem todos os itens
        - Usuários comuns: veem apenas itens disponíveis (excluindo 'trocado')
        """
        if self.request.user.is_authenticated:
            if (hasattr(self.request.user, 'is_trade_admin') and 
                self.request.user.is_trade_admin) or self.request.user.is_superuser:
                return Item.objects.all()
        
        # Usuários comuns veem apenas itens disponíveis
        return Item.objects.filter(status='disponivel')

    def perform_create(self, serializer):
        """
        Define o proprietário do item como o usuário autenticado
        """
        if self.request.user.is_authenticated:
            serializer.save(owner=self.request.user)
        else:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Usuário deve estar autenticado para criar itens")

    @action(detail=True, methods=['patch'], permission_classes=[IsOwnerOrTradeAdminOrReadOnly])
    def change_status(self, request, pk=None):
        """
        Altera o status de um item
        """
        item = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in ['disponivel', 'indisponível', 'trocado']:
            return Response(
                {'error': 'Status inválido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        item.status = new_status
        item.save()
        
        serializer = self.get_serializer(item)
        return Response(serializer.data)
```

### OfferViewSet (offers/views.py)

```python
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Offer
from .serializers import OfferSerializer

class IsOffererOrOwnerOrTradeAdmin(permissions.BasePermission):
    """
    Permissão para ofertas:
    - Usuários podem ver ofertas que fizeram ou receberam
    - Administradores podem ver todas as ofertas
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        if (hasattr(request.user, 'is_trade_admin') and 
            request.user.is_trade_admin) or request.user.is_superuser:
            return True
        return (obj.offerer == request.user or 
                obj.item_desired.owner == request.user)

class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer
    permission_classes = [IsOffererOrOwnerOrTradeAdmin]

    def get_queryset(self):
        """
        Filtra ofertas baseado no usuário:
        - Administradores: veem todas as ofertas
        - Usuários comuns: veem apenas ofertas que fizeram ou receberam
        """
        if (hasattr(self.request.user, 'is_trade_admin') and 
            self.request.user.is_trade_admin) or self.request.user.is_superuser:
            return Offer.objects.all()
        
        return Offer.objects.filter(
            models.Q(offerer=self.request.user) | 
            models.Q(item_desired__owner=self.request.user)
        )

    def perform_create(self, serializer):
        """
        Valida e cria uma nova oferta
        """
        if self.request.user.is_authenticated:
            offerer = self.request.user
            
            # Validação: não pode oferecer pelo próprio item
            item_desired = serializer.validated_data['item_desired']
            offer_type = serializer.validated_data.get('offer_type', 'item')
            
            if offer_type == 'item':
                item_offered = serializer.validated_data.get('item_offered')
                if item_offered and item_offered.owner != offerer:
                    from rest_framework.exceptions import ValidationError
                    raise ValidationError("Você só pode oferecer seus próprios itens.")
            
            if item_desired.owner == offerer:
                from rest_framework.exceptions import ValidationError
                raise ValidationError("Você não pode fazer uma oferta no seu próprio item.")
            
            serializer.save(offerer=offerer)
        else:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Usuário deve estar autenticado para criar ofertas")

    @action(detail=True, methods=['post'], permission_classes=[IsOffererOrOwnerOrTradeAdmin])
    def accept(self, request, pk=None):
        """
        Aceita uma oferta
        """
        offer = self.get_object()
        
        # Verificação de permissão
        if (offer.item_desired.owner != request.user and 
            not (hasattr(request.user, 'is_trade_admin') and request.user.is_trade_admin) and
            not request.user.is_superuser):
            return Response(
                {'error': 'Você não tem permissão para aceitar esta oferta.'}, 
                status=status.HTTP_403_FORBIDDEN
            )

        # Lógica para aceitar a oferta
        offer.status = 'aceita'
        offer.item_desired.status = 'indisponível'
        
        # Se for oferta de item, marcar o item oferecido como indisponível
        if offer.offer_type == 'item' and offer.item_offered:
            offer.item_offered.status = 'indisponível'
            offer.item_offered.save()
        
        offer.item_desired.save()
        offer.save()
        
        serializer = self.get_serializer(offer)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsOffererOrOwnerOrTradeAdmin])
    def refuse(self, request, pk=None):
        """
        Recusa uma oferta
        """
        offer = self.get_object()
        
        # Verificação de permissão
        if (offer.item_desired.owner != request.user and 
            not (hasattr(request.user, 'is_trade_admin') and request.user.is_trade_admin) and
            not request.user.is_superuser):
            return Response(
                {'error': 'Você não tem permissão para recusar esta oferta.'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        offer.status = 'recusada'
        offer.save()
        
        serializer = self.get_serializer(offer)
        return Response(serializer.data)
```

---

## 🔗 URLs

### URLs Principais (core/urls.py)

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.api_urls')),
]
```

### URLs da API (core/api_urls.py)

```python
from django.urls import path, include

urlpatterns = [
    path('auth/', include('auth_app.urls')),
    path('users/', include('users.urls')),
    path('items/', include('items.urls')),
    path('offers/', include('offers.urls')),
]
```

### URLs de Itens (items/urls.py)

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet

router = DefaultRouter()
router.register(r'', ItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
```

### URLs de Ofertas (offers/urls.py)

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OfferViewSet

router = DefaultRouter()
router.register(r'', OfferViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
```

---

## 🔐 Permissões

### Sistema de Permissões

O sistema utiliza permissões customizadas baseadas em roles:

1. **Usuário Não Autenticado**
   - Apenas leitura de itens disponíveis

2. **Usuário Comum**
   - CRUD de próprios itens
   - Criação e gerenciamento de próprias ofertas
   - Leitura de ofertas enviadas/recebidas

3. **Trade Admin** (`is_trade_admin=True`)
   - Todas as permissões de usuário comum
   - Alteração de status de qualquer item
   - Aceitar/recusar ofertas de qualquer item

4. **Superusuário**
   - Controle total do sistema
   - Exclusão de qualquer item
   - Gerenciamento de usuários

### Implementação de Permissões

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

---

## 🔍 Filtros e Busca

### Configuração de Filtros

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
}

# views.py
class ItemViewSet(viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'status']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'title']
    ordering = ['-created_at']
```

### Exemplos de Uso

```bash
# Filtrar por categoria
GET /api/items/?category=livros

# Filtrar por status
GET /api/items/?status=disponivel

# Buscar por título ou descrição
GET /api/items/?search=calculus

# Ordenar por data
GET /api/items/?ordering=-created_at

# Combinar filtros
GET /api/items/?category=livros&status=disponivel&search=math&ordering=-created_at
```

---

## 🔑 Autenticação

### Configuração

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

# Aplicações
INSTALLED_APPS = [
    'rest_framework.authtoken',
    # ... outras aplicações
]
```

### Views de Autenticação

```python
# auth_app/views.py
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Criar token para o usuário
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'name': user.name,
            },
            'token': token.key
        }, status=status.HTTP_201_CREATED)

class LoginView(generics.GenericAPIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {'error': 'Username e password são obrigatórios'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)
        
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'name': user.name,
                    'is_trade_admin': getattr(user, 'is_trade_admin', False),
                    'is_superuser': user.is_superuser,
                },
                'token': token.key
            })
        else:
            return Response(
                {'error': 'Credenciais inválidas'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
```

---

## 🐳 Deploy

### Dockerfile

```dockerfile
FROM python:3.11-slim

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Criar usuário não-root
RUN adduser --disabled-password --gecos '' appuser

# Definir diretório de trabalho
WORKDIR /app

# Copiar e instalar dependências Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código da aplicação
COPY . .

# Criar diretórios para arquivos estáticos e media
RUN mkdir -p /app/staticfiles /app/media

# Alterar proprietário dos arquivos
RUN chown -R appuser:appuser /app

# Mudar para usuário não-root
USER appuser

# Expor porta
EXPOSE 8000

# Comando para executar a aplicação
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "core.wsgi:application"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=tradesite
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: .
    command: >
      sh -c "sleep 10 &&
             python manage.py migrate &&
             python manage.py collectstatic --noinput &&
             gunicorn --bind 0.0.0.0:8000 core.wsgi:application"
    environment:
      - SECRET_KEY=django-insecure-88kl-y8-y-rj-5281cv29d_wdw-a-h-lrh-wo9_5t3--o-4-k
      - DEBUG=False
      - ALLOWED_HOSTS=localhost,127.0.0.1
      - DATABASE_URL=postgresql://user:password@db:5432/tradesite
    ports:
      - "8000:8000"
    depends_on:
      - db
    volumes:
      - .:/app

volumes:
  postgres_data:
```

### Comandos de Deploy

```bash
# Build e execução
docker compose up --build -d

# Ver logs
docker compose logs -f backend

# Executar comandos Django
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser

# Parar serviços
docker compose down
```

---

## 🧪 Testes

### Estrutura de Testes

```
backend/
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_views.py
│   └── test_serializers.py
├── manage.py
└── requirements.txt
```

### Exemplo de Teste

```python
# tests/test_models.py
from django.test import TestCase
from django.contrib.auth import get_user_model
from items.models import Item

User = get_user_model()

class ItemModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_item_creation(self):
        item = Item.objects.create(
            title='Test Item',
            description='Test Description',
            category='livros',
            owner=self.user
        )
        self.assertEqual(item.title, 'Test Item')
        self.assertEqual(item.owner, self.user)
        self.assertEqual(item.status, 'disponivel')
```

### Executar Testes

```bash
# Executar todos os testes
python manage.py test

# Executar testes específicos
python manage.py test items.tests

# Executar com cobertura
coverage run --source='.' manage.py test
coverage report
```

---

## 📊 Logs e Monitoramento

### Configuração de Logs

```python
# settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'django.log',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}
```

### Health Check

```python
# views.py
from django.http import JsonResponse
from django.db import connection

def health_check(request):
    try:
        # Testar conexão com banco
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        
        return JsonResponse({
            'status': 'healthy',
            'database': 'connected'
        })
    except Exception as e:
        return JsonResponse({
            'status': 'unhealthy',
            'error': str(e)
        }, status=500)
```

---

## 🔧 Comandos de Gerenciamento

### Comandos Úteis

```bash
# Criar migrações
python manage.py makemigrations

# Aplicar migrações
python manage.py migrate

# Criar superusuário
python manage.py createsuperuser

# Coletar arquivos estáticos
python manage.py collectstatic

# Shell interativo
python manage.py shell

# Verificar configurações
python manage.py check

# Executar servidor de desenvolvimento
python manage.py runserver

# Executar testes
python manage.py test
```

### Comandos Customizados

```python
# management/commands/create_test_data.py
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from items.models import Item

User = get_user_model()

class Command(BaseCommand):
    help = 'Cria dados de teste'

    def handle(self, *args, **options):
        # Criar usuários de teste
        user1 = User.objects.create_user(
            username='user1',
            email='user1@test.com',
            password='testpass123'
        )
        
        # Criar itens de teste
        Item.objects.create(
            title='Livro de Teste',
            description='Descrição de teste',
            category='livros',
            owner=user1
        )
        
        self.stdout.write(
            self.style.SUCCESS('Dados de teste criados com sucesso!')
        )
```

---

**Documentação do Backend atualizada em: Janeiro 2024**
