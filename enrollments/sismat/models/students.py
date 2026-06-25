from django.db import models
from django.core.exceptions import ValidationError
from .base import BaseModel
from .users import Users

def validate_min_phone_digits(value):
    if value and len(value) < 9:
        raise ValidationError("El número telefónico debe tener un mínimo de 9 dígitos.")

class Students(BaseModel):
    names = models.CharField(max_length=100, db_column='names')
    fatherSurname = models.CharField(max_length=100, db_column='fathersurname') # <-- Forzar minúscula de Supabase
    motherSurname = models.CharField(max_length=100, db_column='mothersurname') # <-- Forzar minúscula de Supabase
    gender = models.CharField(max_length=20, null=True, blank=True, db_column='gender')
    address = models.TextField(null=True, blank=True, db_column='address')
    phone = models.CharField(max_length=20, null=True, blank=True, validators=[validate_min_phone_digits], db_column='phone')
    note = models.TextField(null=True, blank=True, db_column='note')
    
    user_id = models.OneToOneField(Users, on_delete=models.SET_NULL, null=True, blank=True, db_column='user_id')

    class Meta:
        db_table = 'students'
        verbose_name_plural = "Students"

    def __str__(self):
        return f"{self.fatherSurname} {self.motherSurname}, {self.names}"

    def save(self, *args, **kwargs):
        self.names = self.names.upper()
        self.fatherSurname = self.fatherSurname.upper()
        self.motherSurname = self.motherSurname.upper()
        super(Students, self).save(*args, **kwargs)