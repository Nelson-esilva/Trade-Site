# offers/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Offer
from .serializers import OfferSerializer

class IsOffererOrOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.offerer == request.user or obj.item_desired.owner == request.user

class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer
    permission_classes = [permissions.IsAuthenticated, IsOffererOrOwner]

    def perform_create(self, serializer):
        # Validação para garantir que o usuário não está oferecendo por seu próprio item
        item_desired = serializer.validated_data['item_desired']
        if item_desired.owner == self.request.user:
            raise serializers.ValidationError("Você não pode fazer uma oferta no seu próprio item.")
        serializer.save(offerer=self.request.user)

    def get_queryset(self):
        """
        Filtra as ofertas para que o usuário veja apenas as que ele fez ou recebeu.
        """
        user = self.request.user
        return Offer.objects.filter(models.Q(offerer=user) | models.Q(item_desired__owner=user))

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def accept(self, request, pk=None):
        offer = self.get_object()
        if offer.item_desired.owner != request.user:
            return Response({'error': 'Você não tem permissão para aceitar esta oferta.'}, status=status.HTTP_403_FORBIDDEN)

        # Lógica para aceitar a oferta
        offer.status = 'aceita'
        offer.item_desired.status = 'trocado'
        offer.item_offered.status = 'trocado'
        offer.item_desired.save()
        offer.item_offered.save()
        offer.save()
        return Response({'status': 'oferta aceita'})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def refuse(self, request, pk=None):
        offer = self.get_object()
        if offer.item_desired.owner != request.user:
            return Response({'error': 'Você não tem permissão para recusar esta oferta.'}, status=status.HTTP_403_FORBIDDEN)
        
        offer.status = 'recusada'
        offer.save()
        return Response({'status': 'oferta recusada'})