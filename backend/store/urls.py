from django.urls import path
from .views import (
    ProductViewSet, CheckoutView, StripeWebhookView,
    WholesaleInquiryView, get_stripe_config
)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = router.urls + [
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('stripe/webhook/', StripeWebhookView.as_view(), name='stripe-webhook'),
    path('stripe/config/', get_stripe_config, name='stripe-config'),
    path('wholesale-inquiry/', WholesaleInquiryView.as_view(), name='wholesale-inquiry'),
]
