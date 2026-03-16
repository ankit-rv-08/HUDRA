from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    permission_classes = [AllowAny]

    def list(self, request):
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data) 
        serializer.is_valid(raise_exception=True)       
        
        if request.user.is_authenticated:   
            serializer.save(created_by=request.user)
        else:
            serializer.save()

        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        task = Task.objects.get(pk=pk)
        serializer = TaskSerializer(task)
        return Response(serializer.data)


@api_view(['POST'])
def task_checkout(request, pk):
    task = Task.objects.get(pk=pk)
    task.is_paid = True
    task.save()
    return Response({"message": "Task marked as paid"})