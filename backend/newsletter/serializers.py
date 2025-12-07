from rest_framework import serializers
from .models import NewsletterSubscriber, NewsletterCampaign


class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ['id', 'email', 'first_name', 'is_active', 'source', 'subscribed_at']
        read_only_fields = ['is_active', 'subscribed_at']


class NewsletterSubscribeSerializer(serializers.Serializer):
    """Serializer for newsletter subscription"""
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=100, required=False, allow_blank=True)
    source = serializers.CharField(max_length=50, required=False, default='website')
