from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.TaskViewSet)  # existing

urlpatterns = [
    router.urls,
    path('<int:pk>/checkout/', views.task_checkout, name='task-checkout'),  # ADD THIS
    path('<int:pk>/assign/', views.AssignTaskView.as_view()),  # existing
]
