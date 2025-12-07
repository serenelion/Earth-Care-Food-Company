from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
import google.generativeai as genai

from .models import ConversationThread, Message
from .serializers import ConversationThreadSerializer, ChatMessageSerializer, MessageSerializer
from store.models import Customer

# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)

SYSTEM_INSTRUCTION = """
You are the "Earth Care Coach," a wise and persuasive AI assistant for Earth Care Food Company. 
Your goal is to educate users about permaculture and the gut-brain connection, and then MASTERFULLY pivot that education into selling our products.

**Your Persona:**
- Warm, earthy, and deeply knowledgeable (like a mix of a nutritionist and a regenerative farmer).
- You believe that "healing the soil heals the gut."
- You are helpful but always focused on conversion (getting them to pre-order/subscribe).

**Your Product Knowledge (Sell these!):**
1. **Catskills Greek Yogurt ($12 / 32oz)**: 
   - *Hook*: The ultimate gut-brain food. High protein (20g) for neurotransmitter production. Thick, creamy, zero waste.
   - *Sell*: "If you want mental clarity, start your day with this."
2. **Ancestral Kefir ($10 / 32oz)**: 
   - *Hook*: "The Champagne of Dairy." Potent probiotics for mood regulation.
   - *Sell*: "Feeling sluggish or anxious? Your microbiome needs this reboot."
3. **Regenerative Whey Powder ($45 / 2lb)**: 
   - *Hook*: Bioavailable recovery. Don't let good protein go to waste.
   - *Sell*: "Perfect for rebuilding your body after a long day or workout."

**Conversation Strategy:**
- **The Gut-Brain Axis**: If they mention mood, stress, or fog, explain how 90% of serotonin is made in the gut, then recommend the Kefir or Yogurt.
- **Permaculture**: If they ask about the farm, explain how we close the loop on waste, then suggest buying the Whey (which is saved from waste).
- **Closing**: Always end with a gentle nudge to "add to cart" or "start your subscription."

**Tone:**
- Educational but sales-driven.
- Concise (keep responses under 3 sentences unless asked for deep dives).
- Use emojis sparingly (🌱, 🥛, ✨).
"""


class ChatView(APIView):
    """
    Handle AI chat conversations with Gemini
    Save all conversations to the database
    """
    def post(self, request):
        serializer = ChatMessageSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        session_id = serializer.validated_data['session_id']
        user_message = serializer.validated_data['message']
        email = serializer.validated_data.get('email', '')
        
        # Get or create conversation thread
        thread, created = ConversationThread.objects.get_or_create(
            session_id=session_id,
            defaults={'email': email}
        )
        
        # Link to customer if email matches
        if email and not thread.customer:
            try:
                customer = Customer.objects.get(email=email)
                thread.customer = customer
                thread.save()
            except Customer.DoesNotExist:
                pass
        
        # Save user message
        Message.objects.create(
            thread=thread,
            role='user',
            content=user_message,
            user_ip=self._get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        # Get AI response using Gemini
        try:
            ai_response = self._get_gemini_response(user_message)
        except Exception as e:
            ai_response = "I'm currently disconnected from the earth grid. Please try again later."
            print(f"Gemini API error: {e}")
        
        # Save AI message
        Message.objects.create(
            thread=thread,
            role='ai',
            content=ai_response
        )
        
        return Response({
            'message': ai_response,
            'session_id': session_id
        }, status=status.HTTP_200_OK)
    
    def _get_gemini_response(self, user_message):
        """Get response from Gemini API"""
        try:
            model = genai.GenerativeModel(
                'gemini-2.0-flash-exp',
                system_instruction=SYSTEM_INSTRUCTION
            )
            
            response = model.generate_content(user_message)
            return response.text if response.text else "I couldn't quite unearth an answer for that. Try asking something else!"
        except Exception as e:
            print(f"Error generating content: {e}")
            return "The mycelium network is currently busy. Please try again later."
    
    def _get_client_ip(self, request):
        """Get client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


@api_view(['GET'])
def get_conversation_history(request, session_id):
    """Get conversation history for a session"""
    try:
        thread = ConversationThread.objects.get(session_id=session_id)
        serializer = ConversationThreadSerializer(thread)
        return Response(serializer.data)
    except ConversationThread.DoesNotExist:
        return Response({'messages': []}, status=status.HTTP_200_OK)
