from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

from .models import NewsletterSubscriber
from .serializers import NewsletterSubscribeSerializer


@method_decorator(csrf_exempt, name='dispatch')
class NewsletterSubscribeView(APIView):
    """
    Handle newsletter subscriptions
    CSRF exempt because this is a public API endpoint
    """
    def post(self, request):
        serializer = NewsletterSubscribeSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        email = serializer.validated_data['email']
        first_name = serializer.validated_data.get('first_name', '')
        source = serializer.validated_data.get('source', 'website')
        
        # Check if already subscribed
        subscriber, created = NewsletterSubscriber.objects.get_or_create(
            email=email,
            defaults={
                'first_name': first_name,
                'source': source,
                'is_active': True
            }
        )
        
        if not created:
            if subscriber.is_active:
                return Response({
                    'message': 'You are already subscribed to our newsletter!'
                }, status=status.HTTP_200_OK)
            else:
                # Reactivate subscription
                subscriber.is_active = True
                subscriber.unsubscribed_at = None
                subscriber.save()
        
        # Send welcome email
        self._send_welcome_email(subscriber)
        
        return Response({
            'message': 'Successfully subscribed to the newsletter! Check your email for a special welcome offer.',
            'subscribed': True
        }, status=status.HTTP_201_CREATED)
    
    def _send_welcome_email(self, subscriber):
        """Send welcome email to new subscriber"""
        if not settings.SENDGRID_API_KEY:
            print("SendGrid API key not configured")
            return
        
        try:
            message = Mail(
                from_email=settings.FROM_EMAIL,
                to_emails=subscriber.email,
                subject='Welcome to Earth Care Food Company! 🌱',
                html_content=f'''
                <html>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                            <h1 style="color: #4a5d23;">Welcome to Earth Care Food Company!</h1>
                            
                            <p>Hi {subscriber.first_name or 'there'},</p>
                            
                            <p>Thank you for subscribing to our newsletter! We're thrilled to have you join our community of health-conscious food lovers who care about the planet.</p>
                            
                            <h2 style="color: #4a5d23;">🎁 Special Welcome Offer</h2>
                            <p style="font-size: 18px; background-color: #f4f4f4; padding: 15px; border-left: 4px solid #4a5d23;">
                                <strong>Get 10% off your first order!</strong><br>
                                Subscribe at checkout to automatically receive your discount.
                            </p>
                            
                            <h3>What to Expect:</h3>
                            <ul>
                                <li>🥛 Updates on new products and seasonal offerings</li>
                                <li>🌱 Tips on gut health and the gut-brain connection</li>
                                <li>♻️ Stories from our zero-waste dairy farm</li>
                                <li>🎯 Exclusive subscriber-only deals</li>
                            </ul>
                            
                            <p style="margin-top: 30px;">
                                <a href="{settings.FRONTEND_URL}" style="background-color: #4a5d23; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                                    Start Shopping
                                </a>
                            </p>
                            
                            <p style="margin-top: 30px; color: #666; font-size: 14px;">
                                Questions? Reply to this email – we'd love to hear from you!
                            </p>
                            
                            <p style="margin-top: 20px; color: #666; font-size: 12px;">
                                If you didn't subscribe to this newsletter, you can 
                                <a href="{settings.FRONTEND_URL}/unsubscribe?email={subscriber.email}">unsubscribe here</a>.
                            </p>
                        </div>
                    </body>
                </html>
                '''
            )
            
            sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
            response = sg.send(message)
            print(f"Welcome email sent to {subscriber.email}: Status {response.status_code}")
            
        except Exception as e:
            print(f"Error sending welcome email: {e}")


@api_view(['POST'])
def unsubscribe(request):
    """Handle newsletter unsubscription"""
    email = request.data.get('email')
    
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        subscriber = NewsletterSubscriber.objects.get(email=email)
        subscriber.is_active = False
        from django.utils import timezone
        subscriber.unsubscribed_at = timezone.now()
        subscriber.save()
        
        return Response({
            'message': 'You have been unsubscribed from our newsletter.'
        }, status=status.HTTP_200_OK)
        
    except NewsletterSubscriber.DoesNotExist:
        return Response({
            'message': 'Email not found in our subscriber list.'
        }, status=status.HTTP_404_NOT_FOUND)
