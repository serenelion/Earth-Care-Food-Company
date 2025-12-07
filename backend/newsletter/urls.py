from django.urls import path
from .views import NewsletterSubscribeView, unsubscribe

urlpatterns = [
    path('subscribe/', NewsletterSubscribeView.as_view(), name='newsletter-subscribe'),
    path('unsubscribe/', unsubscribe, name='newsletter-unsubscribe'),
]
