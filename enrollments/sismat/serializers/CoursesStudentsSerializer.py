from rest_framework import serializers
from ..models.courses_students import CoursesStudents
from .CourseSerializer import CourseSerializer
from .StudentSerializer import StudentSerializer


class CoursesStudentsSerializer(serializers.ModelSerializer):


    class Meta:
        model = CoursesStudents
        fields = '__all__'


class CoursesStudentsDetailSerializer(serializers.ModelSerializer):
    """Serializer anidado — usado en GET por id (retrieve).
    Incluye los objetos Course y Student completos."""

    course = CourseSerializer(read_only=True)
    student = StudentSerializer(read_only=True)

    class Meta:
        model = CoursesStudents
        fields = '__all__'