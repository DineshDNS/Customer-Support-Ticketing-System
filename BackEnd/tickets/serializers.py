from rest_framework import serializers
from .models import Ticket


class TicketCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Ticket
        fields = ['title', 'description', 'priority']

    def create(self, validated_data):
        user = self.context['request'].user
        return Ticket.objects.create(
            created_by=user,
            **validated_data
        )
    

class TicketListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = [
            'id',
            'ticket_code',
            'title',
            'priority',
            'status',
            'created_at'
        ]

class TicketDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = [
            'id',
            'ticket_code',
            'title',
            'description',
            'priority',
            'status',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['ticket_code', 'created_at', 'updated_at']

class DashboardRecentTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = [
            "id",
            "ticket_code",
            "title",
            "priority",
            "status",
            "created_at",
        ]
