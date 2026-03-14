from django.urls import path
from .views import task_checkout, TaskViewSet

urlpatterns = [
    path('', TaskViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('<int:pk>/', TaskViewSet.as_view({'get': 'retrieve'})),
    path('<int:pk>/checkout/', task_checkout),
]