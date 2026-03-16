from django.db import models

class Task(models.Model):

    title = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    budget = models.DecimalField(max_digits=8, decimal_places=2)

    description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title