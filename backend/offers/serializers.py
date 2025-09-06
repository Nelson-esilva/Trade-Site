# offers/serializers.py

from rest_framework import serializers
from .models import Offer

class OfferSerializer(serializers.ModelSerializer):
    offerer = serializers.ReadOnlyField(source='offerer.username')

    class Meta:
        model = Offer
        fields = ['id', 'item_desired', 'item_offered', 'offerer', 'status', 'created_at']