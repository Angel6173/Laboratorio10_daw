from django.db import models
from .base import BaseModel

class Users(BaseModel):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('teacher', 'Teacher'),
        ('student', 'Student'),
    ]
    
    USER_STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('suspended', 'Suspended'),
    ]
    
    email = models.EmailField(max_length=150, unique=True, db_column='email')
    passwordHash = models.TextField(db_column='passwordhash')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student', db_column='role')
    
    status = models.CharField(max_length=20, choices=USER_STATUS_CHOICES, default='active', db_column='status')

    class Meta:
        db_table = 'users'
        verbose_name_plural = "Users"

    def __str__(self):
        return f"{self.email} [{self.role.upper()}]"