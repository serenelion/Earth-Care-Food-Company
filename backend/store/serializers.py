from rest_framework import serializers
from .models import Product, Customer, Order, OrderItem, WholesaleInquiry


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'tagline', 'description', 'price', 'unit', 'image', 'benefits', 'is_active', 'stock_quantity']
        read_only_fields = ['created_at', 'updated_at']


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'email', 'first_name', 'last_name', 'phone', 'is_subscribed', 'subscription_discount']
        read_only_fields = ['stripe_customer_id', 'created_at', 'updated_at']


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'unit_price', 'total_price']
        read_only_fields = ['total_price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    customer_email = serializers.EmailField(source='customer.email', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'customer', 'customer_email', 'order_number', 'status',
            'subtotal', 'discount_amount', 'total_amount',
            'shipping_first_name', 'shipping_last_name',
            'shipping_address_line1', 'shipping_address_line2',
            'shipping_city', 'shipping_state', 'shipping_zip_code', 'shipping_country',
            'payment_method', 'paid_at', 'notes', 'items', 'created_at'
        ]
        read_only_fields = ['order_number', 'stripe_payment_intent_id', 'paid_at', 'created_at', 'updated_at']


class CheckoutSerializer(serializers.Serializer):
    """Serializer for checkout process"""
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    
    # Cart items
    cart_items = serializers.ListField(
        child=serializers.DictField()
    )
    
    # Shipping
    shipping_address_line1 = serializers.CharField(max_length=200)
    shipping_address_line2 = serializers.CharField(max_length=200, required=False, allow_blank=True)
    shipping_city = serializers.CharField(max_length=100)
    shipping_state = serializers.CharField(max_length=50)
    shipping_zip_code = serializers.CharField(max_length=20)
    shipping_country = serializers.CharField(max_length=100, default='USA')
    
    # Optional
    notes = serializers.CharField(required=False, allow_blank=True)
    subscribe_newsletter = serializers.BooleanField(default=False)


class WholesaleInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = WholesaleInquiry
        fields = [
            'id', 'business_name', 'contact_name', 'email', 'phone',
            'business_type', 'location', 'website', 'estimated_monthly_volume',
            'message', 'status', 'created_at'
        ]
        read_only_fields = ['status', 'created_at', 'updated_at']
