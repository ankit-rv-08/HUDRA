from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    title = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    budget = models.DecimalField(max_digits=8, decimal_places=2)

    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)

    is_completed = models.BooleanField(default=False)
    is_paid = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title