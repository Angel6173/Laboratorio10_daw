from rest_framework import serializers
from ..models.students import Students
from .UserSerializer import UserSerializer


class StudentSerializer(serializers.ModelSerializer):


    class Meta:
        model = Students
        fields = '__all__'


class StudentDetailSerializer(serializers.ModelSerializer):


    user_id = UserSerializer(read_only=True)

    enrolled_courses = serializers.SerializerMethodField()

    class Meta:
        model = Students
        fields = '__all__'

    def get_enrolled_courses(self, obj):
        from .CourseSerializer import CourseSerializer
        courses = [cs.course for cs in obj.coursesstudents_set.select_related('course').all()]
        return CourseSerializer(courses, many=True).data