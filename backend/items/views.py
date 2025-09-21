# items/views.py

from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Item
from .serializers import ItemSerializer

class IsOwnerOrTradeAdmin(permissions.BasePermission):
    """
    Permissão customizada para permitir que apenas os donos ou administradores de troca editem itens.
    """
    def has_object_permission(self, request, view, obj):
        # Superusuários e administradores de troca têm acesso total
        if hasattr(request.user, 'is_trade_admin') and request.user.is_trade_admin:
            return True
        if request.user.is_superuser:
            return True
            
        # Para métodos seguros (GET, HEAD, OPTIONS), todos podem ver
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # Para outros métodos, apenas o dono pode editar
        return obj.owner == request.user

class IsTradeAdminOrReadOnly(permissions.BasePermission):
    """
    Permissão para permitir que apenas administradores de troca façam operações de escrita.
    """
    def has_permission(self, request, view):
        # Superusuários e administradores de troca têm acesso total
        if hasattr(request.user, 'is_trade_admin') and request.user.is_trade_admin:
            return True
        if request.user.is_superuser:
            return True
            
        # Para métodos seguros, todos podem acessar
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # Para outros métodos, apenas administradores
        return False

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [IsOwnerOrTradeAdmin]
    
    # Filtros
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'status']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'title']
    ordering = ['-created_at']

    def perform_create(self, serializer):
        # Usuário deve estar autenticado para criar itens
        if self.request.user.is_authenticated:
            serializer.save(owner=self.request.user)
        else:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Usuário deve estar autenticado para criar itens")

    def get_queryset(self):
        """
        Retorna itens baseado nas permissões do usuário.
        - Superusuários e administradores: todos os itens
        - Usuários comuns: apenas itens disponíveis
        """
        user = self.request.user
        
        # Superusuários e administradores de troca veem todos os itens
        if hasattr(user, 'is_trade_admin') and user.is_trade_admin:
            return Item.objects.all()
        if user.is_superuser:
            return Item.objects.all()
            
        # Usuários comuns veem apenas itens disponíveis
        return Item.objects.filter(status='disponivel')

    @action(detail=True, methods=['patch'], permission_classes=[IsOwnerOrTradeAdmin])
    def change_status(self, request, pk=None):
        """
        Permite alterar o status de um item.
        - Donos podem alterar status dos próprios itens
        - Administradores podem alterar status de qualquer item
        """
        item = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in ['disponivel', 'indisponível', 'trocado']:
            return Response({'error': 'Status inválido'}, status=400)
            
        item.status = new_status
        item.save()
        
        serializer = self.get_serializer(item)
        return Response(serializer.data)