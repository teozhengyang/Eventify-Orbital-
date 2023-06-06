from rest_framework import viewsets
from .serializers import EventSerializer, UserSerializer
from .models import Event, User
from django.db.models import Q
from django.core import serializers

# jwt imports
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import NewTokenObtainPairSerializer
from django.views.decorators.csrf import csrf_exempt
import json

# view for user
class UserView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# handles GET & POST requests for event data based on current user
@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def get_Events(request):
    if request.method == 'GET':
        user = request.user.id
        events = Event.objects.filter(Q(participants=user)|Q(organizers=user))
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = EventSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    elif request.method == 'DELETE':
        item = serializers.deserialize("json", request.body)
        print(item)
        real = Event.objects.filter(pk=item.pk)
        print(real)
        return Response()


# register view
@csrf_exempt
def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        password2 = data.get('password2')
        first_name = data.get('first_name')
        last_name = data.get('last_name')

        if not username or not email or not password or not password2 or not first_name or not last_name:
            return JsonResponse({'error': 'Please fill in all fields'}, status=201)

        if password != password2:
            return JsonResponse({'error': 'Passwords do not match'}, status=201)
              
        try:
            # Check if the username or email is already taken
            if User.objects.filter(username=username).exists():
                return JsonResponse({'error': 'Username is already taken'}, status=201)

            if User.objects.filter(email=email).exists():
                return JsonResponse({'error': 'Email is already registered'}, status=201)

            # Create a new user
            user = User.objects.create_user(username=username, email=email, password=password, first_name=first_name, last_name=last_name, budget=0)
            profile = Profile(user=user, first_name=first_name, last_name=last_name, email=email)
            profile.save()

            return JsonResponse({'success': 'User registered successfully'}, status=201)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)
      
@api_view(['GET'])
def get_routes(request):
    routes = [
        '/token',
        '/token/refresh'
    ]
    return Response(routes)

class NewTokenObtainPairView(TokenObtainPairView):
    serializer_class= NewTokenObtainPairSerializer