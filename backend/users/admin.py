# users/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# Registra o modelo User com a interface UserAdmin padrão do Django.
admin.site.register(User, UserAdmin)