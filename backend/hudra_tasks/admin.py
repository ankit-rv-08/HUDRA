from django.contrib import admin
from .models import Task, Application, Message, Wallet, Transaction, Review, Dispute

admin.site.register(Task)
admin.site.register(Application)
admin.site.register(Message)
admin.site.register(Wallet)
admin.site.register(Transaction)
admin.site.register(Review)
admin.site.register(Dispute)