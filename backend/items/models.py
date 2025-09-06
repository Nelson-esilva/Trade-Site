from django.db import models
from django.conf import settings

class Item(models.Model):
    STATUS_CHOICES = [
        ('disponivel', 'Disponível'),
        ('indisponível', 'Indisponível'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='items')
    status = models.CharField(max_length=255, choices=STATUS_CHOICES, default='disponivel')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title