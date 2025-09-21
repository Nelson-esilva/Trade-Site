from django.db import models
from django.conf import settings
from items.models import Item

class Offer(models.Model):
    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('aceita', 'Aceita'),
        ('recusada', 'Recusada'),
    ]

    OFFER_TYPE_CHOICES = [
        ('item', 'Item'),
        ('money', 'Dinheiro'),
    ]

    item_desired = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='offers_received')
    item_offered = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='offers_made', null=True, blank=True)
    offerer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='offers')
    offer_type = models.CharField(max_length=10, choices=OFFER_TYPE_CHOICES, default='item')
    money_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Valor em dinheiro (se oferta for em dinheiro)")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pendente')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Oferta de {self.offerer.username} por {self.item_desired.title}"