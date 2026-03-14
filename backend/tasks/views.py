import stripe  # TOP line
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated  
from rest_framework.response import Response
from django.conf import settings

from .models import Task

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def task_checkout(request, pk):
    stripe.api_key = settings.STRIPE_SECRET_KEY
    task = Task.objects.get(id=pk)
    intent = stripe.PaymentIntent.create(
        amount=task.reward * 100,  # paise (₹500 = 50000)
        currency='inr',
        metadata={'task_id': pk, 'user_id': request.user.id}
    )
    return Response({'client_secret': intent['client_secret']})
