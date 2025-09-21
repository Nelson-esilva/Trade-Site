# items/views.py

from rest_framework import viewsets, permissions
from .models import Item
from .serializers import ItemSerializer

# DESENVOLVIMENTO: Comentada a permissão customizada
# class IsOwnerOrReadOnly(permissions.BasePermission):
#     """
#     Permissão customizada para permitir que apenas os donos de um objeto o editem.
#     """
#     def has_object_permission(self, request, view, obj):
#         if request.method in permissions.SAFE_METHODS:
#             return True
#         return obj.owner == request.user

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    # DESENVOLVIMENTO: Removidas todas as permissões
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        # DESENVOLVIMENTO: Se não há usuário logado, usa o primeiro usuário disponível
        if hasattr(self.request, 'user') and self.request.user.is_authenticated:
            owner = self.request.user
        else:
            from users.models import User
            owner = User.objects.first()
            if not owner:
                # Se não há usuários, cria um usuário padrão
                owner = User.objects.create_user(
                    username='dev_user',
                    email='dev@example.com',
                    name='Usuário Desenvolvimento'
                )
        serializer.save(owner=owner)

    def get_queryset(self):
        """
        DESENVOLVIMENTO: Retorna todos os itens (não filtra por status).
        """
        return Item.objects.all()
        # Opcional: Filtra os itens para mostrar apenas os disponíveis.
        # return Item.objects.filter(status='disponivel')