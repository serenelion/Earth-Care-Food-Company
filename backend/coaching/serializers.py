from rest_framework import serializers
from .models import ConversationThread, Message


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'role', 'content', 'timestamp']
        read_only_fields = ['timestamp']


class ConversationThreadSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    
    class Meta:
        model = ConversationThread
        fields = ['id', 'session_id', 'email', 'started_at', 'last_activity', 'is_active', 'messages']
        read_only_fields = ['started_at', 'last_activity']


class ChatMessageSerializer(serializers.Serializer):
    """Serializer for chat messages"""
    session_id = serializers.CharField(max_length=100)
    message = serializers.CharField()
    email = serializers.EmailField(required=False, allow_blank=True)
