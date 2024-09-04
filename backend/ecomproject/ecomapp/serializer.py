
from rest_framework import serializers
from django.contrib.auth.models import User 
from .models import Movies , Myrating

    





# serializers.py
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        extra_kwargs = {'password': {'write_only': True}}
        fields = ['username', 'email', 'password']
        
    

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
    
    
class MoviesSerializer(serializers.ModelSerializer):
    class Meta:
        model=Movies
        fields='__all__'
        


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()  # Change from EmailField to CharField
    password = serializers.CharField()

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Myrating
        fields = '__all__'