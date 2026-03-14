from django.urls import path
from .views import task_checkout

urlpatterns = [
    path('<int:pk>/checkout/', task_checkout),
]