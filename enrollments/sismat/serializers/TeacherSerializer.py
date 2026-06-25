from rest_framework import serializers
from ..models.teachers import Teachers
from .UserSerializer import UserSerializer


class TeacherSerializer(serializers.ModelSerializer):


    class Meta:
        model = Teachers
        fields = '__all__'


class TeacherDetailSerializer(serializers.ModelSerializer):


    user_id = UserSerializer(read_only=True)

    class Meta:
        model = Teachers
        fields = '__all__'