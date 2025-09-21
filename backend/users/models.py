from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    name = models.CharField(max_length=255,blank=False, null=False)
    is_trade_admin = models.BooleanField(default=False, help_text="Designa se este usuário é um administrador do sistema de trocas")
    
    def __str__(self):
        return self.username