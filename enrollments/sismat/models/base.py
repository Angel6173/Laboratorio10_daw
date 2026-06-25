from django.db import models
import uuid

class BaseModel(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    
    # UUIDs de auditoría para registrar qué usuario interactuó con el registro
    created_id = models.UUIDField(null=True, blank=True)
    modified_id = models.UUIDField(null=True, blank=True)

    class Meta:
        abstract = True