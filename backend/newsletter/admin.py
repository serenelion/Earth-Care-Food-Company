from django.contrib import admin
from .models import NewsletterSubscriber, NewsletterCampaign


@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'is_active', 'source', 'subscribed_at')
    list_filter = ('is_active', 'source', 'subscribed_at')
    search_fields = ('email', 'first_name')
    list_editable = ('is_active',)
    readonly_fields = ('subscribed_at', 'unsubscribed_at')
    
    fieldsets = (
        ('Subscriber Information', {
            'fields': ('email', 'first_name', 'source')
        }),
        ('Status', {
            'fields': ('is_active', 'subscribed_at', 'unsubscribed_at')
        }),
    )

    actions = ['export_active_emails']

    def export_active_emails(self, request, queryset):
        """Action to export active subscriber emails"""
        active_subs = queryset.filter(is_active=True)
        emails = ', '.join([sub.email for sub in active_subs])
        self.message_user(request, f"Active emails ({active_subs.count()}): {emails}")
    export_active_emails.short_description = "Export active subscriber emails"


@admin.register(NewsletterCampaign)
class NewsletterCampaignAdmin(admin.ModelAdmin):
    list_display = ('subject', 'status', 'recipients_count', 'opened_count', 'clicked_count', 'scheduled_for', 'sent_at')
    list_filter = ('status', 'scheduled_for', 'sent_at', 'created_at')
    search_fields = ('subject', 'content_text')
    readonly_fields = ('recipients_count', 'opened_count', 'clicked_count', 'sent_at', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Campaign Information', {
            'fields': ('subject', 'status', 'scheduled_for')
        }),
        ('Content', {
            'fields': ('content_html', 'content_text')
        }),
        ('Analytics', {
            'fields': ('recipients_count', 'opened_count', 'clicked_count', 'sent_at'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
