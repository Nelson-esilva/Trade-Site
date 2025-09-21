# offers/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import models
from .models import Offer
from .serializers import OfferSerializer

# DESENVOLVIMENTO: Comentada a permissão customizada
# class IsOffererOrOwner(permissions.BasePermission):
#     def has_object_permission(self, request, view, obj):
#         return obj.offerer == request.user or obj.item_desired.owner == request.user

class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer
    # DESENVOLVIMENTO: Removidas todas as permissões
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        # DESENVOLVIMENTO: Se não há usuário logado, usa o primeiro usuário disponível
        if hasattr(self.request, 'user') and self.request.user.is_authenticated:
            offerer = self.request.user
        else:
            from users.models import User
            offerer = User.objects.first()
            if not offerer:
                # Se não há usuários, cria um usuário padrão
                offerer = User.objects.create_user(
                    username='dev_user',
                    email='dev@example.com',
                    name='Usuário Desenvolvimento'
                )
        
        # DESENVOLVIMENTO: Comentada a validação de não oferecer pelo próprio item
        # item_desired = serializer.validated_data['item_desired']
        # if item_desired.owner == offerer:
        #     raise serializers.ValidationError("Você não pode fazer uma oferta no seu próprio item.")
        
        serializer.save(offerer=offerer)

    def get_queryset(self):
        """
        DESENVOLVIMENTO: Retorna todas as ofertas (sem filtro por usuário).
        """
        return Offer.objects.all()
        # Filtra as ofertas para que o usuário veja apenas as que ele fez ou recebeu.
        # user = self.request.user
        # return Offer.objects.filter(models.Q(offerer=user) | models.Q(item_desired__owner=user))

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        """
        DESENVOLVIMENTO: Aceita oferta sem verificação de permissão.
        """
        offer = self.get_object()
        
        # DESENVOLVIMENTO: Comentada a verificação de permissão
        # if offer.item_desired.owner != request.user:
        #     return Response({'error': 'Você não tem permissão para aceitar esta oferta.'}, status=status.HTTP_403_FORBIDDEN)

        # Lógica para aceitar a oferta
        offer.status = 'aceita'
        offer.item_desired.status = 'trocado'
        offer.item_offered.status = 'trocado'
        offer.item_desired.save()
        offer.item_offered.save()
        offer.save()
        return Response({'status': 'oferta aceita'})

    @action(detail=True, methods=['post'])
    def refuse(self, request, pk=None):
        """
        DESENVOLVIMENTO: Recusa oferta sem verificação de permissão.
        """
        offer = self.get_object()
        
        # DESENVOLVIMENTO: Comentada a verificação de permissão
        # if offer.item_desired.owner != request.user:
        #     return Response({'error': 'Você não tem permissão para recusar esta oferta.'}, status=status.HTTP_403_FORBIDDEN)
        
        offer.status = 'recusada'
        offer.save()
        return Response({'status': 'oferta recusada'})