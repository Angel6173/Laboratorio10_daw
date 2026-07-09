from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from ..models.users import Users


class UserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Users
        exclude = ['passwordHash']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = Users(**validated_data)
        user.passwordHash = make_password(password) if password else ''
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.passwordHash = make_password(password)
        instance.save()
        return instance
