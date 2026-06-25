from rest_framework import serializers
from ..models.users import Users


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = Users
        exclude = ['passwordHash']