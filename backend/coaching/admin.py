from django.contrib import admin
from .models import ConversationThread, Message


class MessageInline(admin.TabularInline):
    model = Message
    extra = 0
    readonly_fields = ('timestamp',)
    fields = ('role', 'content', 'timestamp')


@admin.register(ConversationThread)
class ConversationThreadAdmin(admin.ModelAdmin):
    list_display = ('session_id', 'customer', 'email', 'started_at', 'last_activity', 'is_active')
    list_filter = ('is_active', 'started_at', 'last_activity')
    search_fields = ('session_id', 'customer__email', 'email')
    readonly_fields = ('session_id', 'started_at', 'last_activity')
    inlines = [MessageInline]
    
    fieldsets = (
        ('Conversation Info', {
            'fields': ('session_id', 'customer', 'email', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('started_at', 'last_activity')
        }),
    )


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('thread', 'role', 'content_preview', 'timestamp')
    list_filter = ('role', 'timestamp')
    search_fields = ('thread__session_id', 'content')
    readonly_fields = ('timestamp',)
    
    def content_preview(self, obj):
        return obj.content[:100] + '...' if len(obj.content) > 100 else obj.content
    content_preview.short_description = 'Content Preview'
