from django.db import models
from django.core.validators import EmailValidator


class NewsletterSubscriber(models.Model):
    """Model for newsletter subscribers"""
    email = models.EmailField(unique=True, validators=[EmailValidator()])
    first_name = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    source = models.CharField(
        max_length=50, 
        default='website',
        help_text="Where did they subscribe from? e.g., website, wholesale form, checkout"
    )
    subscribed_at = models.DateTimeField(auto_now_add=True)
    unsubscribed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-subscribed_at']
        verbose_name = 'Newsletter Subscriber'
        verbose_name_plural = 'Newsletter Subscribers'

    def __str__(self):
        return f"{self.email} - {'Active' if self.is_active else 'Unsubscribed'}"


class NewsletterCampaign(models.Model):
    """Model for tracking newsletter campaigns"""
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('scheduled', 'Scheduled'),
        ('sent', 'Sent'),
        ('cancelled', 'Cancelled'),
    ]

    subject = models.CharField(max_length=200)
    content_html = models.TextField(help_text="HTML content of the email")
    content_text = models.TextField(help_text="Plain text version")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    scheduled_for = models.DateTimeField(null=True, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    recipients_count = models.IntegerField(default=0)
    opened_count = models.IntegerField(default=0)
    clicked_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Newsletter Campaign'
        verbose_name_plural = 'Newsletter Campaigns'

    def __str__(self):
        return f"{self.subject} - {self.status}"
