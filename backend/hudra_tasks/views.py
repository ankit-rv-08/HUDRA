from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('-created_at')
    serializer_class = TaskSerializer
    
    @action(detail=False, methods=['get'])
    def my_tasks(self, request):
        """Get tasks posted or assigned to user"""
        tasks = Task.objects.filter(poster=request.user) | Task.objects.filter(assignee=request.user)
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        """Assign task to current user"""
        task = self.get_object()
        if task.status != 'posted':
            return Response({'error': 'Task not available'}, status=status.HTTP_400_BAD_REQUEST)
        
        task.assignee = request.user
        task.status = 'assigned'
        task.save()
        serializer = self.get_serializer(task)
        return Response(serializer.data)

