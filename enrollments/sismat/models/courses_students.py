from django.db import models
from .base import BaseModel
from .courses import Courses
from .students import Students

class CoursesStudents(BaseModel):
    # La buena práctica en Django es nombrar al objeto en singular ('course' y 'student').
    # Con db_column le decimos que en Supabase la columna física se llama exactamente 'course_id' y 'student_id'.
    course = models.ForeignKey(Courses, on_delete=models.CASCADE, db_column='course_id')
    student = models.ForeignKey(Students, on_delete=models.CASCADE, db_column='student_id')
    
    # Solución al problema del borrado recursivo (fuerza la búsqueda en minúsculas)
    enrollmentDate = models.DateTimeField(auto_now_add=True, db_column='enrollmentdate')

    class Meta:
        db_table = 'courses_students'
        verbose_name_plural = "Courses Students"
        # Usamos los nombres de los atributos definidos arriba para la clave única compuesta
        unique_together = ('course', 'student')

    def __str__(self):
        return f"Matrícula: {self.student} en {self.course.courseName}"