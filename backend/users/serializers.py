from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo User. Expõe os campos essenciais.
    """
    class Meta:
        model = User
        # Lista de campos que serão retornados na API.
        fields = ['id', 'username', 'email', 'first_name', 'last_name']