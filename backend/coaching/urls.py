from django.urls import path
from .views import ChatView, get_conversation_history

urlpatterns = [
    path('chat/', ChatView.as_view(), name='chat'),
    path('conversation/<str:session_id>/', get_conversation_history, name='conversation-history'),
]
