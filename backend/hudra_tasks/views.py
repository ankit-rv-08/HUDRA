import re
import stripe
from django.conf import settings
from django.db import transaction as db_transaction
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import Task, Application, Message, Wallet, Transaction, Review, Dispute
from .serializers import (
    TaskSerializer, ApplicationSerializer, MessageSerializer,
    WalletSerializer, ReviewSerializer, DisputeSerializer, TransactionSerializer
)

PII_PATTERN = re.compile(
    r'(\+?\d[\d\s\-]{7,}\d'
    r'|[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)',
    re.IGNORECASE
)


def clean_message(content):
    return PII_PATTERN.sub('[blocked]', content)


# ─── TASKS ────────────────────────────────────────────────────────────────────

class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        qs = Task.objects.all().order_by('-created_at')
        category = self.request.query_params.get('category')
        status_filter = self.request.query_params.get('status')
        if category:
            qs = qs.filter(category=category)
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class TaskDetailView(generics.RetrieveUpdateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]


# ─── APPLICATIONS ─────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_to_task(request, pk):
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response({'error': 'Task not found'}, status=404)

    if task.status != 'open':
        return Response({'error': 'Task is not open for applications'}, status=400)

    if task.created_by == request.user:
        return Response({'error': 'You cannot apply to your own task'}, status=400)

    if Application.objects.filter(task=task, applicant=request.user).exists():
        return Response({'error': 'You have already applied'}, status=400)

    serializer = ApplicationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(task=task, applicant=request.user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def appoint_tasker(request, pk, application_id):
    try:
        task = Task.objects.get(pk=pk)
        application = Application.objects.get(pk=application_id, task=task)
    except (Task.DoesNotExist, Application.DoesNotExist):
        return Response({'error': 'Not found'}, status=404)

    if task.created_by != request.user:
        return Response({'error': 'Only the task lister can appoint'}, status=403)

    if task.status != 'open':
        return Response({'error': 'Task is not open'}, status=400)

    application.status = 'accepted'
    application.save()

    Application.objects.filter(task=task).exclude(pk=application_id).update(status='rejected')

    task.assigned_to = application.applicant
    task.status = 'appointed'
    task.save()

    return Response({'message': 'Tasker appointed', 'task': TaskSerializer(task).data})


# ─── PAYMENTS ─────────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_intent(request, pk):
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response({'error': 'Task not found'}, status=404)

    if task.created_by != request.user:
        return Response({'error': 'Only the lister can pay'}, status=403)

    if task.status != 'appointed':
        return Response({'error': 'Task must be appointed before payment'}, status=400)

    task.status = 'payment_confirmed'
    task.save()

    return Response({'message': 'Payment confirmed', 'status': task.status})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_task(request, pk):
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response({'error': 'Task not found'}, status=404)

    if task.created_by != request.user:
        return Response({'error': 'Only the lister can mark complete'}, status=403)

    if task.status not in ['in_progress', 'payment_confirmed']:
        return Response({'error': 'Task must be in progress to complete'}, status=400)

    commission_rate = 0.10
    payout = task.budget * (1 - commission_rate)

    with db_transaction.atomic():
        task.status = 'completed'
        task.save()

        wallet, _ = Wallet.objects.get_or_create(user=task.assigned_to)
        wallet.balance += payout
        wallet.lifetime_earnings += payout
        wallet.save()

        Transaction.objects.create(
            wallet=wallet,
            amount=payout,
            type='credit',
            description=f'Payment for: {task.title}'
        )

    return Response({'message': 'Task completed. Funds released to tasker wallet.'})


# ─── MESSAGES ─────────────────────────────────────────────────────────────────

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def task_messages(request, pk):
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response({'error': 'Task not found'}, status=404)

    is_involved = (task.created_by == request.user or task.assigned_to == request.user)
    if not is_involved:
        return Response({'error': 'Not authorized'}, status=403)

    if task.status not in ['appointed', 'payment_confirmed', 'in_progress', 'completed']:
        return Response({'error': 'Chat only available after appointment'}, status=400)

    if request.method == 'GET':
        messages = task.messages.order_by('created_at')
        return Response(MessageSerializer(messages, many=True).data)

    content = clean_message(request.data.get('content', ''))
    if not content.strip():
        return Response({'error': 'Message cannot be empty'}, status=400)

    msg = Message.objects.create(task=task, sender=request.user, content=content)
    return Response(MessageSerializer(msg).data, status=201)


# ─── WALLET ───────────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_wallet(request):
    wallet, _ = Wallet.objects.get_or_create(user=request.user)
    return Response(WalletSerializer(wallet).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def withdraw(request):
    wallet, _ = Wallet.objects.get_or_create(user=request.user)
    amount = request.data.get('amount')

    if not amount:
        return Response({'error': 'Amount required'}, status=400)

    amount = float(amount)
    if amount <= 0:
        return Response({'error': 'Invalid amount'}, status=400)

    if wallet.balance < amount:
        return Response({'error': 'Insufficient balance'}, status=400)

    wallet.balance -= amount
    wallet.save()

    Transaction.objects.create(
        wallet=wallet,
        amount=amount,
        type='withdrawal',
        description='Manual withdrawal'
    )

    return Response({'message': f'Withdrawal of {amount} processed', 'new_balance': float(wallet.balance)})


# ─── REVIEWS ──────────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def leave_review(request, pk):
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response({'error': 'Task not found'}, status=404)

    if task.status != 'completed':
        return Response({'error': 'Can only review completed tasks'}, status=400)

    is_involved = (task.created_by == request.user or task.assigned_to == request.user)
    if not is_involved:
        return Response({'error': 'Not authorized'}, status=403)

    reviewee = task.assigned_to if request.user == task.created_by else task.created_by

    if Review.objects.filter(task=task, reviewer=request.user).exists():
        return Response({'error': 'Already reviewed'}, status=400)

    serializer = ReviewSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(task=task, reviewer=request.user, reviewee=reviewee)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


# ─── DISPUTES ─────────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def report_dispute(request, pk):
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response({'error': 'Task not found'}, status=404)

    is_involved = (task.created_by == request.user or task.assigned_to == request.user)
    if not is_involved:
        return Response({'error': 'Not authorized'}, status=403)

    serializer = DisputeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(task=task, reported_by=request.user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


# ─── DASHBOARD ────────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def lister_dashboard(request):
    user = request.user
    posted = Task.objects.filter(created_by=user).order_by('-created_at')
    return Response({
        'active_tasks': TaskSerializer(posted.filter(status__in=['open', 'appointed', 'payment_confirmed', 'in_progress']), many=True).data,
        'completed_tasks': TaskSerializer(posted.filter(status='completed'), many=True).data,
        'total_posted': posted.count(),
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def tasker_dashboard(request):
    user = request.user
    wallet, _ = Wallet.objects.get_or_create(user=user)
    applications = Application.objects.filter(applicant=user).order_by('-created_at')
    assigned = Task.objects.filter(assigned_to=user).order_by('-created_at')
    avg_rating = Review.objects.filter(reviewee=user)
    rating_val = None
    if avg_rating.exists():
        rating_val = round(sum(r.rating for r in avg_rating) / avg_rating.count(), 1)

    return Response({
        'applications_sent': ApplicationSerializer(applications, many=True).data,
        'tasks_assigned': TaskSerializer(assigned, many=True).data,
        'tasks_completed': TaskSerializer(assigned.filter(status='completed'), many=True).data,
        'wallet_balance': float(wallet.balance),
        'lifetime_earnings': float(wallet.lifetime_earnings),
        'average_rating': rating_val,
        'total_reviews': avg_rating.count(),
    })