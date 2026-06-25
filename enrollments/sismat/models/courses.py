from django.db import models
from django.core.exceptions import ValidationError
from .base import BaseModel
from .teachers import Teachers

def validate_positive_credits(value):
    if value <= 0:
        raise ValidationError("Un curso debe otorgar al menos 1 crédito académico.")

class Courses(BaseModel):
    courseName = models.CharField(max_length=150, db_column='coursename') # <-- Forzar minúscula de Supabase
    credits = models.IntegerField(validators=[validate_positive_credits], db_column='credits')
    description = models.TextField(null=True, blank=True, db_column='description')
    
    teacher_id = models.ForeignKey(Teachers, on_delete=models.SET_NULL, null=True, blank=True, db_column='teacher_id')

    class Meta:
        db_table = 'courses'
        verbose_name_plural = "Courses"

    def __str__(self):
        return f"{self.courseName} ({self.credits} créditos)"

    def save(self, *args, **kwargs):
        self.courseName = self.courseName.strip()
        super(Courses, self).save(*args, **kwargs)