# items/serializers.py

from rest_framework import serializers
from .models import Item

class ItemSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Item
        fields = ['id', 'title', 'description', 'owner', 'status', 'created_at', 'updated_at']