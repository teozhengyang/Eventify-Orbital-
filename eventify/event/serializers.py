from rest_framework.serializers import ModelSerializer
from . import models
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(ModelSerializer):
    class Meta:
        model = models.User
        fields = ('id', 'username', 'password','first_name', 'last_name', 'email', 'budget')

class EventSerializer(ModelSerializer):
    class Meta:
        model = models.Event
        fields = '__all__'

class NewTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token
    
