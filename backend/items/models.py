from django.db import models
from django.conf import settings

class Item(models.Model):
    STATUS_CHOICES = [
        ('disponivel', 'Disponível'),
        ('indisponível', 'Indisponível'),
    ]

    CATEGORY_CHOICES = [
        ('livros', 'Livros'),
        ('apostilas', 'Apostilas'),
        ('equipamentos', 'Equipamentos'),
        ('tecnologia', 'Tecnologia'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='livros')
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='items')
    status = models.CharField(max_length=255, choices=STATUS_CHOICES, default='disponivel')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title