from django.contrib import admin
from .models.users import Users
from .models.students import Students
from .models.teachers import Teachers
from .models.courses import Courses
from .models.courses_students import CoursesStudents

@admin.register(Users)
class UsersAdmin(admin.ModelAdmin):
    list_display = ('email', 'role', 'status', 'created')
    list_filter = ('role', 'status')
    search_fields = ('email',)

@admin.register(Students)
class StudentsAdmin(admin.ModelAdmin):
    list_display = ('fatherSurname', 'names', 'phone', 'status')
    search_fields = ('names', 'fatherSurname')

@admin.register(Teachers)
class TeachersAdmin(admin.ModelAdmin):
    list_display = ('fatherSurname', 'names', 'specialty', 'status')
    search_fields = ('names', 'fatherSurname')
    list_filter = ('specialty', 'status')

@admin.register(Courses)
class CoursesAdmin(admin.ModelAdmin):
    list_display = ('courseName', 'credits', 'status')
    search_fields = ('courseName',)
    list_filter = ('credits', 'status')

@admin.register(CoursesStudents)
class CoursesStudentsAdmin(admin.ModelAdmin):
    # Ahora sí detectará 'course' y 'student' perfectamente sin lanzar el error E108
    list_display = ('course', 'student', 'enrollmentDate', 'status')
    list_filter = ('status', 'course')