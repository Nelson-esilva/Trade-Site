from django.db import models
from django.conf import settings

class Item(models.Model):
    STATUS_CHOICES = [
        ('disponivel', 'Disponível'),
        ('indisponível', 'Indisponível'),
        ('trocado', 'Trocado'),
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
    location = models.CharField(max_length=255, default="Não informado", help_text="Cidade/Estado")
    address = models.TextField(default="Não informado", help_text="Endereço completo")
    image_url = models.URLField(blank=True, null=True, help_text="URL da imagem do produto")
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='items')
    status = models.CharField(max_length=255, choices=STATUS_CHOICES, default='disponivel')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title