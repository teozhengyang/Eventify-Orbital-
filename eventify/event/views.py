from rest_framework import viewsets
from .serializers import EventSerializer, UserSerializer, ActivitySerializer
from .models import Event, User, Activity
from django.db.models import Q

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
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def event_list(request, format=None):
    if request.method == 'GET':
        user = request.user.id
        events = Event.objects.filter(Q(organizers=user) | Q(participants=user)).distinct()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = EventSerializer(data=request.data)
        serializer.is_valid(raise_exception=True) 
        serializer.save()
        return Response(serializer.data)

# handles GET, PUT & DELETE requests using primary key
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def event_detail(request, pk, format=None):
    if request.method == 'PUT':
        event = Event.objects.get(pk=pk)
        serializer = EventSerializer(event, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
    elif request.method == 'DELETE':
        event = Event.objects.get(pk=pk)
        if event:
            event.delete()
            return Response('Deleted event')
        else:
            return Response('Failed to delete')
    elif request.method == 'GET':
        event = Event.objects.get(pk=pk)
        serializer = EventSerializer(event)
        return Response(serializer.data)



# handles GET & POST requests for activity data based on associated event
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def activity_list(request, format=None):
    if request.method == 'GET':
        eventID = request.GET.get("EventID")
        event = Event.objects.get(pk=eventID)
        activities = Activity.objects.filter(event=event)
        serializer = ActivitySerializer(activities, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = ActivitySerializer(data=request.data)
        serializer.is_valid(raise_exception=True) 
        serializer.save()
        return Response(serializer.data)
    
# (PENDING USE) handles PUT & DELETE requests, finds relevant event by primary key for activity
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def activity_detail(request, pk, format=None):
    if request.method == 'PUT':
        activity = Activity.objects.get(pk=pk)
        serializer = ActivitySerializer(activity, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
    elif request.method == 'DELETE':
        activity = Activity.objects.get(pk=pk)
        if activity:
            activity.delete()
            return Response('Deleted event')
        else:
            return Response('Failed to delete')
    elif request.method == 'GET':
        activity = Activity.objects.get(pk=pk)
        serializer = EventSerializer(activity)
        return Response(serializer.data)

@csrf_exempt
def delete_user(request, pk):
    if request.method == 'DELETE':
        user = User.objects.get(pk=pk)
        if user:
            user.delete()
            return Response('Deleted user')
        else:
            return Response('Failed to delete')

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