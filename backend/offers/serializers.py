# offers/serializers.py

from rest_framework import serializers
from .models import Offer
from items.serializers import ItemSerializer

class OfferSerializer(serializers.ModelSerializer):
    offerer = serializers.ReadOnlyField(source='offerer.username')
    item_desired_data = ItemSerializer(source='item_desired', read_only=True)
    item_offered_data = ItemSerializer(source='item_offered', read_only=True)

    class Meta:
        model = Offer
        fields = ['id', 'item_desired', 'item_offered', 'offerer', 'offer_type', 'money_amount', 'status', 'created_at', 'item_desired_data', 'item_offered_data']

    def validate(self, data):
        """
        Validação customizada para garantir que:
        - Se offer_type for 'item', item_offered deve ser fornecido
        - Se offer_type for 'money', money_amount deve ser fornecido
        """
        offer_type = data.get('offer_type', 'item')
        
        if offer_type == 'item' and not data.get('item_offered'):
            raise serializers.ValidationError("item_offered é obrigatório quando offer_type é 'item'")
        
        if offer_type == 'money' and not data.get('money_amount'):
            raise serializers.ValidationError("money_amount é obrigatório quando offer_type é 'money'")
        
        return data