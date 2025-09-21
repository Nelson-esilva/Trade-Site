# users/views.py

from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para listar e visualizar usuários.
    DESENVOLVIMENTO: Sem permissões - acesso livre para todos.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # DESENVOLVIMENTO: Removidas todas as permissões
    permission_classes = [permissions.AllowAny]

    # DESENVOLVIMENTO: Comentado o método de permissões
    # def get_permissions(self):
    #     """
    #     Define permissões diferentes para ações diferentes.
    #     - 'list': Apenas administradores.
    #     - 'retrieve', 'me': Qualquer usuário autenticado.
    #     """
    #     if self.action == 'list':
    #         self.permission_classes = [permissions.IsAdminUser]
    #     else:
    #         self.permission_classes = [permissions.IsAuthenticated]
    #     return super().get_permissions()

    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        """
        Endpoint customizado que retorna os dados do usuário logado.
        DESENVOLVIMENTO: Retorna o primeiro usuário disponível.
        Acessível em /api/users/me/
        """
        # DESENVOLVIMENTO: Se não há usuário logado, retorna o primeiro usuário
        if hasattr(request, 'user') and request.user.is_authenticated:
            user = request.user
        else:
            user = User.objects.first()
            if not user:
                return Response({'error': 'Nenhum usuário encontrado'}, status=404)
        
        serializer = self.get_serializer(user)
        return Response(serializer.data)