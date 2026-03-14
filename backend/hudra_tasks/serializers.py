# serializers.py
from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'reward', 'is_completed', 'is_paid', 'created_at', 'created_by']
        read_only_fields = ['created_at', 'created_by', 'is_completed', 'is_paid']