from django.urls import path
from . import views

urlpatterns = [
    # Tasks
    path('', views.TaskListCreateView.as_view()),
    path('<int:pk>/', views.TaskDetailView.as_view()),

    # Applications
    path('<int:pk>/apply/', views.apply_to_task),
    path('<int:pk>/appoint/<int:application_id>/', views.appoint_tasker),

    # Payments
    path('<int:pk>/pay/', views.create_payment_intent),
    path('<int:pk>/complete/', views.complete_task),

    # Messages
    path('<int:pk>/messages/', views.task_messages),

    # Reviews & Disputes
    path('<int:pk>/review/', views.leave_review),
    path('<int:pk>/dispute/', views.report_dispute),

    # Wallet
    path('wallet/me/', views.my_wallet),
    path('wallet/withdraw/', views.withdraw),

    # Dashboards
    path('dashboard/lister/', views.lister_dashboard),
    path('dashboard/tasker/', views.tasker_dashboard),
]