from rest_framework import serializers
from ..models.courses import Courses
from .TeacherSerializer import TeacherSerializer


class CourseSerializer(serializers.ModelSerializer):


    class Meta:
        model = Courses
        fields = '__all__'


class CourseDetailSerializer(serializers.ModelSerializer):

    teacher_id = TeacherSerializer(read_only=True)
    enrolled_students = serializers.SerializerMethodField()

    class Meta:
        model = Courses
        fields = '__all__'

    def get_enrolled_students(self, obj):
        from .StudentSerializer import StudentSerializer
        students = [cs.student for cs in obj.coursesstudents_set.select_related('student').all()]
        return StudentSerializer(students, many=True).data