from django.contrib import admin
from .models import Product, Customer, Order, OrderItem, WholesaleInquiry


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('total_price',)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'unit', 'stock_quantity', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'tagline', 'description')
    list_editable = ('price', 'stock_quantity', 'is_active')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Product Information', {
            'fields': ('id', 'name', 'tagline', 'description', 'price', 'unit')
        }),
        ('Images & Benefits', {
            'fields': ('image', 'benefits')
        }),
        ('Inventory & Stripe', {
            'fields': ('stock_quantity', 'is_active', 'stripe_product_id', 'stripe_price_id')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_subscribed', 'subscription_discount', 'created_at')
    list_filter = ('is_subscribed', 'created_at')
    search_fields = ('email', 'first_name', 'last_name', 'phone')
    readonly_fields = ('stripe_customer_id', 'created_at', 'updated_at')
    fieldsets = (
        ('Contact Information', {
            'fields': ('email', 'first_name', 'last_name', 'phone')
        }),
        ('Subscription', {
            'fields': ('is_subscribed', 'subscription_discount')
        }),
        ('Stripe', {
            'fields': ('stripe_customer_id',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'customer', 'status', 'total_amount', 'created_at', 'paid_at')
    list_filter = ('status', 'created_at', 'paid_at')
    search_fields = ('order_number', 'customer__email', 'shipping_first_name', 'shipping_last_name')
    readonly_fields = ('order_number', 'created_at', 'updated_at')
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('Order Information', {
            'fields': ('order_number', 'customer', 'status')
        }),
        ('Pricing', {
            'fields': ('subtotal', 'discount_amount', 'total_amount')
        }),
        ('Shipping Address', {
            'fields': (
                'shipping_first_name', 'shipping_last_name',
                'shipping_address_line1', 'shipping_address_line2',
                'shipping_city', 'shipping_state', 'shipping_zip_code', 'shipping_country'
            )
        }),
        ('Payment', {
            'fields': ('stripe_payment_intent_id', 'payment_method', 'paid_at')
        }),
        ('Additional', {
            'fields': ('notes',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_readonly_fields(self, request, obj=None):
        if obj:  # Editing an existing object
            return self.readonly_fields + ('subtotal', 'discount_amount', 'total_amount')
        return self.readonly_fields


@admin.register(WholesaleInquiry)
class WholesaleInquiryAdmin(admin.ModelAdmin):
    list_display = ('business_name', 'contact_name', 'email', 'status', 'created_at')
    list_filter = ('status', 'business_type', 'created_at')
    search_fields = ('business_name', 'contact_name', 'email', 'location')
    list_editable = ('status',)
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Business Information', {
            'fields': ('business_name', 'business_type', 'location', 'website', 'estimated_monthly_volume')
        }),
        ('Contact Information', {
            'fields': ('contact_name', 'email', 'phone')
        }),
        ('Inquiry', {
            'fields': ('message', 'status', 'notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
