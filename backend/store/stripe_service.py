import stripe
from django.conf import settings
from decimal import Decimal

stripe.api_key = settings.STRIPE_SECRET_KEY


def create_or_get_stripe_customer(email, first_name='', last_name=''):
    """Create or retrieve a Stripe customer"""
    try:
        # Search for existing customer
        customers = stripe.Customer.list(email=email, limit=1)
        if customers.data:
            return customers.data[0]
        
        # Create new customer
        customer = stripe.Customer.create(
            email=email,
            name=f"{first_name} {last_name}".strip(),
        )
        return customer
    except Exception as e:
        print(f"Error creating/getting Stripe customer: {e}")
        return None


def create_payment_intent(amount, customer_id, metadata=None):
    """
    Create a Stripe Payment Intent
    amount: in cents (multiply by 100)
    """
    try:
        intent = stripe.PaymentIntent.create(
            amount=int(amount * 100),  # Convert to cents
            currency='usd',
            customer=customer_id,
            metadata=metadata or {},
            automatic_payment_methods={'enabled': True},
        )
        return intent
    except Exception as e:
        print(f"Error creating payment intent: {e}")
        return None


def create_checkout_session(line_items, customer_email, success_url, cancel_url, metadata=None):
    """
    Create a Stripe Checkout Session for redirect-based checkout
    """
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            customer_email=customer_email,
            success_url=success_url,
            cancel_url=cancel_url,
            metadata=metadata or {},
            shipping_address_collection={
                'allowed_countries': ['US'],
            },
        )
        return session
    except Exception as e:
        print(f"Error creating checkout session: {e}")
        return None


def create_or_update_product(product_data):
    """Create or update a product in Stripe"""
    try:
        # Check if product already exists
        if product_data.get('stripe_product_id'):
            product = stripe.Product.modify(
                product_data['stripe_product_id'],
                name=product_data['name'],
                description=product_data.get('description', ''),
            )
        else:
            product = stripe.Product.create(
                name=product_data['name'],
                description=product_data.get('description', ''),
            )
        
        # Create or update price
        price = stripe.Price.create(
            product=product.id,
            unit_amount=int(float(product_data['price']) * 100),  # Convert to cents
            currency='usd',
        )
        
        return {
            'product_id': product.id,
            'price_id': price.id
        }
    except Exception as e:
        print(f"Error creating/updating Stripe product: {e}")
        return None


def verify_webhook_signature(payload, sig_header):
    """Verify Stripe webhook signature"""
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
        return event
    except ValueError as e:
        # Invalid payload
        print(f"Invalid payload: {e}")
        return None
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        print(f"Invalid signature: {e}")
        return None
