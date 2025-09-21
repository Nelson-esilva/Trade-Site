# offers/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import models
from .models import Offer
from .serializers import OfferSerializer

class IsOffererOrOwnerOrTradeAdmin(permissions.BasePermission):
    """
    Permissão para ofertas: ofertante, dono do item ou administrador de troca.
    """
    def has_object_permission(self, request, view, obj):
        # Superusuários e administradores de troca têm acesso total
        if hasattr(request.user, 'is_trade_admin') and request.user.is_trade_admin:
            return True
        if request.user.is_superuser:
            return True
            
        # Para métodos seguros, todos podem ver
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # Para outros métodos, apenas ofertante, dono do item ou administradores
        return (obj.offerer == request.user or 
                obj.item_desired.owner == request.user)

class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer
    permission_classes = [IsOffererOrOwnerOrTradeAdmin]

    def perform_create(self, serializer):
        # Usuário deve estar autenticado para criar ofertas
        if self.request.user.is_authenticated:
            offerer = self.request.user
            
            # Validação: não pode oferecer pelo próprio item (apenas para ofertas de item)
            item_desired = serializer.validated_data['item_desired']
            offer_type = serializer.validated_data.get('offer_type', 'item')
            
            if offer_type == 'item':
                item_offered = serializer.validated_data.get('item_offered')
                if item_offered and item_offered.owner == offerer:
                    from rest_framework.exceptions import ValidationError
                    raise ValidationError("Você não pode fazer uma oferta com seu próprio item.")
            
            if item_desired.owner == offerer:
                from rest_framework.exceptions import ValidationError
                raise ValidationError("Você não pode fazer uma oferta no seu próprio item.")
            
            serializer.save(offerer=offerer)
        else:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Usuário deve estar autenticado para criar ofertas")

    def get_queryset(self):
        """
        Retorna ofertas baseado nas permissões do usuário.
        - Superusuários e administradores: todas as ofertas
        - Usuários comuns: apenas ofertas que fizeram ou receberam
        """
        user = self.request.user
        
        # Superusuários e administradores de troca veem todas as ofertas
        if hasattr(user, 'is_trade_admin') and user.is_trade_admin:
            return Offer.objects.all()
        if user.is_superuser:
            return Offer.objects.all()
            
        # Usuários comuns veem apenas ofertas que fizeram ou receberam
        if user.is_authenticated:
            return Offer.objects.filter(
                models.Q(offerer=user) | models.Q(item_desired__owner=user)
            )
        
        return Offer.objects.none()

    @action(detail=True, methods=['post'], permission_classes=[IsOffererOrOwnerOrTradeAdmin])
    def accept(self, request, pk=None):
        """
        Aceita uma oferta. Apenas o dono do item desejado ou administradores podem aceitar.
        """
        offer = self.get_object()
        
        # Verificação de permissão: apenas dono do item ou administradores
        if (offer.item_desired.owner != request.user and 
            not (hasattr(request.user, 'is_trade_admin') and request.user.is_trade_admin) and
            not request.user.is_superuser):
            return Response({'error': 'Você não tem permissão para aceitar esta oferta.'}, 
                          status=status.HTTP_403_FORBIDDEN)

        # Lógica para aceitar a oferta
        offer.status = 'aceita'
        offer.item_desired.status = 'trocado'
        
        # Se for oferta de item, marcar o item oferecido como trocado
        if offer.offer_type == 'item' and offer.item_offered:
            offer.item_offered.status = 'trocado'
            offer.item_offered.save()
        
        offer.item_desired.save()
        offer.save()
        return Response({'status': 'oferta aceita'})

    @action(detail=True, methods=['post'], permission_classes=[IsOffererOrOwnerOrTradeAdmin])
    def refuse(self, request, pk=None):
        """
        Recusa uma oferta. Apenas o dono do item desejado ou administradores podem recusar.
        """
        offer = self.get_object()
        
        # Verificação de permissão: apenas dono do item ou administradores
        if (offer.item_desired.owner != request.user and 
            not (hasattr(request.user, 'is_trade_admin') and request.user.is_trade_admin) and
            not request.user.is_superuser):
            return Response({'error': 'Você não tem permissão para recusar esta oferta.'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        offer.status = 'recusada'
        offer.save()
        return Response({'status': 'oferta recusada'})