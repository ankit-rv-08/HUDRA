from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Task, Application, Message, Wallet, Transaction, Review, Dispute


class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']


class ApplicationSerializer(serializers.ModelSerializer):
    applicant = UserMiniSerializer(read_only=True)

    class Meta:
        model = Application
        fields = ['id', 'task', 'applicant', 'proposal', 'price', 'estimated_hours', 'status', 'created_at']
        read_only_fields = ['applicant', 'status']


class TaskSerializer(serializers.ModelSerializer):
    created_by = UserMiniSerializer(read_only=True)
    assigned_to = UserMiniSerializer(read_only=True)
    applicant_count = serializers.IntegerField(read_only=True)
    applications = ApplicationSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'category', 'location',
            'task_date', 'budget', 'budget_type', 'status',
            'created_by', 'assigned_to', 'applicant_count',
            'applications', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_by', 'assigned_to', 'status']


class MessageSerializer(serializers.ModelSerializer):
    sender = UserMiniSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'task', 'sender', 'content', 'created_at']
        read_only_fields = ['sender']


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'amount', 'type', 'description', 'created_at']


class WalletSerializer(serializers.ModelSerializer):
    transactions = TransactionSerializer(many=True, read_only=True)

    class Meta:
        model = Wallet
        fields = ['id', 'balance', 'lifetime_earnings', 'transactions', 'created_at']


class ReviewSerializer(serializers.ModelSerializer):
    reviewer = UserMiniSerializer(read_only=True)
    reviewee = UserMiniSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'task', 'reviewer', 'reviewee', 'rating', 'comment', 'created_at']
        read_only_fields = ['reviewer']


class DisputeSerializer(serializers.ModelSerializer):
    reported_by = UserMiniSerializer(read_only=True)

    class Meta:
        model = Dispute
        fields = ['id', 'task', 'reported_by', 'reason', 'status', 'admin_note', 'created_at']
        read_only_fields = ['reported_by', 'status', 'admin_note']