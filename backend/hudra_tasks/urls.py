from django.urls import path
from . import views

urlpatterns = [
    path('', views.TaskListCreateView.as_view()),
    path('<int:pk>/', views.TaskDetailView.as_view()),
    path('<int:pk>/apply/', views.apply_to_task),
    path('<int:pk>/appoint/<int:application_id>/', views.appoint_tasker),
    path('<int:pk>/pay/', views.create_payment_intent),
    path('<int:pk>/pay/confirm/', views.confirm_payment),
    path('<int:pk>/complete/', views.complete_task),
    path('<int:pk>/messages/', views.task_messages),
    path('<int:pk>/review/', views.leave_review),
    path('<int:pk>/dispute/', views.report_dispute),
    path('wallet/me/', views.my_wallet),
    path('wallet/withdraw/', views.withdraw),
    path('dashboard/lister/', views.lister_dashboard),
    path('dashboard/tasker/', views.tasker_dashboard),
]
