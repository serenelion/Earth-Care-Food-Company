from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from django.db import transaction
from decimal import Decimal
import uuid

from .models import Product, Customer, Order, OrderItem, WholesaleInquiry
from .serializers import (
    ProductSerializer, CustomerSerializer, OrderSerializer,
    CheckoutSerializer, WholesaleInquirySerializer
)
from .stripe_service import (
    create_or_get_stripe_customer, create_payment_intent,
    verify_webhook_signature
)
from newsletter.models import NewsletterSubscriber


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for viewing products
    Only active products are shown to customers
    """
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer


class WholesaleInquiryView(APIView):
    """
    API endpoint for submitting wholesale inquiries
    """
    def post(self, request):
        serializer = WholesaleInquirySerializer(data=request.data)
        if serializer.is_valid():
            inquiry = serializer.save()
            
            # TODO: Send email notification to admin
            # from .email_service import send_wholesale_inquiry_notification
            # send_wholesale_inquiry_notification(inquiry)
            
            return Response({
                'message': 'Thank you for your wholesale inquiry! We will contact you soon.',
                'inquiry_id': inquiry.id
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CheckoutView(APIView):
    """
    Handle checkout process with Stripe integration
    """
    @transaction.atomic
    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        
        # Get or create customer
        customer, created = Customer.objects.get_or_create(
            email=data['email'],
            defaults={
                'first_name': data['first_name'],
                'last_name': data['last_name'],
                'phone': data.get('phone', ''),
            }
        )
        
        # Update customer info if exists
        if not created:
            customer.first_name = data['first_name']
            customer.last_name = data['last_name']
            customer.phone = data.get('phone', '')
            customer.save()
        
        # Handle newsletter subscription
        if data.get('subscribe_newsletter', False):
            NewsletterSubscriber.objects.get_or_create(
                email=data['email'],
                defaults={
                    'first_name': data['first_name'],
                    'source': 'checkout'
                }
            )
            # Mark customer as subscribed for 10% discount
            customer.is_subscribed = True
            customer.save()
        
        # Calculate cart totals
        cart_items = data['cart_items']
        subtotal = Decimal('0.00')
        order_items_data = []
        
        for item in cart_items:
            try:
                product = Product.objects.get(id=item['id'])
                quantity = int(item['quantity'])
                item_total = product.price * quantity
                subtotal += item_total
                
                order_items_data.append({
                    'product': product,
                    'product_name': product.name,
                    'quantity': quantity,
                    'unit_price': product.price,
                    'total_price': item_total
                })
            except Product.DoesNotExist:
                return Response({
                    'error': f'Product {item["id"]} not found'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        # Calculate discount for subscribers
        discount_amount = Decimal('0.00')
        if customer.is_subscribed:
            discount_amount = subtotal * (customer.subscription_discount / 100)
        
        total_amount = subtotal - discount_amount
        
        # Generate order number
        order_number = f"EC-{uuid.uuid4().hex[:8].upper()}"
        
        # Create order
        order = Order.objects.create(
            customer=customer,
            order_number=order_number,
            status='pending',
            subtotal=subtotal,
            discount_amount=discount_amount,
            total_amount=total_amount,
            shipping_first_name=data['first_name'],
            shipping_last_name=data['last_name'],
            shipping_address_line1=data['shipping_address_line1'],
            shipping_address_line2=data.get('shipping_address_line2', ''),
            shipping_city=data['shipping_city'],
            shipping_state=data['shipping_state'],
            shipping_zip_code=data['shipping_zip_code'],
            shipping_country=data.get('shipping_country', 'USA'),
            notes=data.get('notes', '')
        )
        
        # Create order items
        for item_data in order_items_data:
            OrderItem.objects.create(order=order, **item_data)
        
        # Create Stripe customer
        stripe_customer = create_or_get_stripe_customer(
            email=customer.email,
            first_name=customer.first_name,
            last_name=customer.last_name
        )
        
        if stripe_customer:
            customer.stripe_customer_id = stripe_customer.id
            customer.save()
        
        # Create Stripe Payment Intent
        payment_intent = create_payment_intent(
            amount=total_amount,
            customer_id=stripe_customer.id if stripe_customer else None,
            metadata={
                'order_number': order_number,
                'order_id': str(order.id),
                'customer_email': customer.email
            }
        )
        
        if not payment_intent:
            return Response({
                'error': 'Failed to create payment intent'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        order.stripe_payment_intent_id = payment_intent.id
        order.save()
        
        return Response({
            'client_secret': payment_intent.client_secret,
            'order_number': order_number,
            'order_id': order.id,
            'total_amount': float(total_amount),
            'discount_applied': float(discount_amount)
        }, status=status.HTTP_201_CREATED)


class StripeWebhookView(APIView):
    """
    Handle Stripe webhook events
    """
    def post(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        
        event = verify_webhook_signature(payload, sig_header)
        
        if not event:
            return Response({'error': 'Invalid signature'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Handle different event types
        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            self._handle_successful_payment(payment_intent)
        
        elif event['type'] == 'payment_intent.payment_failed':
            payment_intent = event['data']['object']
            self._handle_failed_payment(payment_intent)
        
        return Response({'status': 'success'}, status=status.HTTP_200_OK)
    
    def _handle_successful_payment(self, payment_intent):
        """Handle successful payment"""
        try:
            order = Order.objects.get(stripe_payment_intent_id=payment_intent['id'])
            order.status = 'paid'
            order.paid_at = timezone.now()
            order.save()
            
            # TODO: Send order confirmation email
            # from .email_service import send_order_confirmation
            # send_order_confirmation(order)
            
        except Order.DoesNotExist:
            print(f"Order not found for payment intent: {payment_intent['id']}")
    
    def _handle_failed_payment(self, payment_intent):
        """Handle failed payment"""
        try:
            order = Order.objects.get(stripe_payment_intent_id=payment_intent['id'])
            order.status = 'cancelled'
            order.notes += f"\n\nPayment failed: {payment_intent.get('last_payment_error', {}).get('message', 'Unknown error')}"
            order.save()
        except Order.DoesNotExist:
            print(f"Order not found for payment intent: {payment_intent['id']}")


@api_view(['GET'])
def get_stripe_config(request):
    """Return Stripe publishable key"""
    from django.conf import settings
    return Response({
        'publishableKey': settings.STRIPE_PUBLISHABLE_KEY
    })
