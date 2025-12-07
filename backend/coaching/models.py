from django.db import models
from store.models import Customer


class ConversationThread(models.Model):
    """Model for storing AI coaching conversation threads"""
    customer = models.ForeignKey(
        Customer, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='conversations'
    )
    session_id = models.CharField(max_length=100, unique=True, help_text="Unique session identifier")
    email = models.EmailField(blank=True, help_text="Email for guest users")
    started_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-last_activity']
        verbose_name = 'Conversation Thread'
        verbose_name_plural = 'Conversation Threads'

    def __str__(self):
        if self.customer:
            return f"Conversation with {self.customer.email} - {self.session_id}"
        return f"Guest conversation - {self.session_id}"


class Message(models.Model):
    """Individual messages in a conversation thread"""
    ROLE_CHOICES = [
        ('user', 'User'),
        ('ai', 'AI Assistant'),
    ]

    thread = models.ForeignKey(ConversationThread, on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    # Optional metadata
    user_ip = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=500, blank=True)

    class Meta:
        ordering = ['timestamp']
        verbose_name = 'Message'
        verbose_name_plural = 'Messages'

    def __str__(self):
        return f"{self.role}: {self.content[:50]}..."
