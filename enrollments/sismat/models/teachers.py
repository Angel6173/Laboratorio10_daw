from django.db import models
from django.core.exceptions import ValidationError
from .base import BaseModel
from .users import Users

def validate_phone_format(value):
    if value and not value.startswith('+'):
        raise ValidationError("El teléfono debe incluir el código de país (Ej: +51).")

class Teachers(BaseModel):
    names = models.CharField(max_length=100, db_column='names')
    fatherSurname = models.CharField(max_length=100, db_column='fathersurname') # <-- Forzar minúscula de Supabase
    motherSurname = models.CharField(max_length=100, db_column='mothersurname') # <-- Forzar minúscula de Supabase
    specialty = models.CharField(max_length=150, null=True, blank=True, db_column='specialty')
    phone = models.CharField(max_length=20, null=True, blank=True, validators=[validate_phone_format], db_column='phone')
    gender = models.CharField(max_length=50, null=True, blank=True, db_column='gender')
    
    user_id = models.OneToOneField(Users, on_delete=models.SET_NULL, null=True, blank=True, db_column='user_id')

    class Meta:
        db_table = 'teachers'
        verbose_name_plural = "Teachers"

    def __str__(self):
        return f"{self.fatherSurname} {self.motherSurname}, {self.names}"

    def save(self, *args, **kwargs):
        self.names = self.names.upper()
        self.fatherSurname = self.fatherSurname.upper()
        self.motherSurname = self.motherSurname.upper()
        super(Teachers, self).save(*args, **kwargs)