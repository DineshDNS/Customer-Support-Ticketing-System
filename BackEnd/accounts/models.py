from django.db import models
from django.contrib.auth.models import AbstractUser

from django.utils import timezone
from django.conf import settings
from datetime import timedelta

class User(AbstractUser):

    ROLE_CHOICES = (
        ('customer', 'Customer'),
        ('agent', 'Agent'),
        ('admin', 'Admin'),
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='customer'
    )

    def __str__(self):
        return f"{self.username} ({self.role})"


class PasswordResetOTP(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="password_otps"
    )
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def is_expired(self):
        return timezone.now() > self.expires_at

    def __str__(self):
        return f"OTP for {self.user.email}"
