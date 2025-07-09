from django.db import models
class ChatMessage(models.Model):
    user_id = models.CharField(max_length=100)
    message = models.TextField()
    reply = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.user_id} at {self.timestamp}"
# Create your models here.
