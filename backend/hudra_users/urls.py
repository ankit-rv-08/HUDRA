from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register),
    path('me/', views.me),
    path('profile/', views.update_profile),
]