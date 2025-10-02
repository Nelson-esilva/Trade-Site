# items/serializers.py

from rest_framework import serializers
from .models import Item

class ItemSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    image_url_or_upload = serializers.ReadOnlyField()

    class Meta:
        model = Item
        fields = ['id', 'title', 'description', 'category', 'location', 'image_url', 'image', 'image_url_or_upload', 'owner', 'status', 'created_at', 'updated_at']
        extra_kwargs = {
            'image': {'required': False, 'allow_null': True, 'write_only': False}
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        return data