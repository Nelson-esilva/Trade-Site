from django.db import models
from django.conf import settings
from items.models import Item

class Offer(models.Model):
    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('aceita', 'Aceita'),
        ('recusada', 'Recusada'),
    ]

    item_desired = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='offers_received')
    item_offered = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='offers_made')
    offerer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='offers')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pendente')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Oferta de {self.offerer.username} por {self.item_desired.title}"