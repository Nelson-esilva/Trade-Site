from django.db import models
from django.conf import settings
import os

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
    image_url = models.URLField(blank=True, null=True, help_text="URL da imagem do produto")
    image = models.ImageField(upload_to='item_images/', blank=True, null=True, help_text="Imagem do produto")
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='items')
    status = models.CharField(max_length=255, choices=STATUS_CHOICES, default='disponivel')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def image_url_or_upload(self):
        """Retorna a URL da imagem uploadada ou a image_url se não houver upload"""
        if self.image:
            # Retornar URL absoluta da imagem uploadada
            from django.conf import settings
            # Usar o domínio do backend (localhost:8000 em desenvolvimento)
            base_url = 'http://localhost:8000'
            url = f"{base_url}{self.image.url}"
            return url
        return self.image_url

    def __str__(self):
        return self.title