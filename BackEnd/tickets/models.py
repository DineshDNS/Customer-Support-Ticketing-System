from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class Ticket(models.Model):

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]

    ticket_code = models.CharField(
        max_length=20,
        unique=True
    )

    title = models.CharField(max_length=255)
    description = models.TextField()

    priority = models.CharField(
        max_length=10,
        choices=PRIORITY_CHOICES,
        default='medium'
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='open'
    )

    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='tickets'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.pk:
            super().save(*args, **kwargs)
            self.ticket_code = f"#TCK-{self.id:04d}"
            return super().save(update_fields=['ticket_code'])

        return super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.ticket_code} - {self.title} ({self.status})"
