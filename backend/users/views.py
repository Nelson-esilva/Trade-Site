# users/views.py

from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para listar e visualizar usuários.
    - A listagem de todos os usuários é permitida apenas para administradores.
    - A visualização de um usuário específico é permitida para qualquer usuário autenticado.
    - Adiciona uma rota customizada 'me' para o usuário ver seus próprios dados.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        """
        Define permissões diferentes para ações diferentes.
        - 'list': Apenas administradores.
        - 'retrieve', 'me': Qualquer usuário autenticado.
        """
        if self.action == 'list':
            self.permission_classes = [permissions.IsAdminUser]
        else:
            self.permission_classes = [permissions.IsAuthenticated]
        return super().get_permissions()

    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        """
        Endpoint customizado que retorna os dados do usuário logado.
        Acessível em /api/users/me/
        """
        user = request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data)