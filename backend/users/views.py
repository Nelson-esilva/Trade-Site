# users/views.py

from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer

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

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para listar e visualizar usuários.
    - Lista: apenas administradores de troca
    - Detalhes: usuários autenticados
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsTradeAdminOrReadOnly]

    def get_permissions(self):
        """
        Define permissões diferentes para ações diferentes.
        - 'list': Apenas administradores de troca.
        - 'retrieve', 'me': Qualquer usuário autenticado.
        """
        if self.action == 'list':
            self.permission_classes = [IsTradeAdminOrReadOnly]
        else:
            self.permission_classes = [permissions.IsAuthenticated]
        return super().get_permissions()

    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        """
        Endpoint customizado que retorna os dados do usuário logado.
        Acessível em /api/users/me/
        """
        if request.user.is_authenticated:
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        else:
            return Response({'error': 'Usuário não autenticado'}, status=401)