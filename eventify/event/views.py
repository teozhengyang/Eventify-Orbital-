from django.shortcuts import render
from rest_framework import viewsets
from .serializers import EventSerializer, UserSerializer, ProfileSerializer
from .models import Event, User, Profile
from django import forms
import calendar
from datetime import datetime
from django.http import HttpResponse
# jwt imports
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import NewTokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
import json

# View for event
class EventView(viewsets.ModelViewSet):
  queryset = Event.objects.all()
  serializer_class = EventSerializer

# view for user
class UserView(viewsets.ModelViewSet):
  queryset = User.objects.all()
  serializer_class = UserSerializer

# Potentially temporary while we create frontend + backend
class NewEventForm(forms.Form):
  event = forms.CharField(label="Event Name")
  start = forms.DateField(label="Start Date")
  end = forms.DateField(label="End Date")

def index(request):
  # when user is logged in
  if request.user.is_authenticated:
    user = User.objects.get(username=request.user.username)
    currdate = datetime.now()
    month = calendar.Calendar().monthdatescalendar(currdate.year, currdate.month)

    return render(request, "event/index.html", {
      "month": month,
      "head": currdate.strftime("%B %Y")
    })
  # for user not logged in
  return HttpResponse('not logged in')

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
        
def eventpage(request):
  return render(request, "event/newevent.html", {
    "form": NewEventForm()
  })

@api_view(['GET'])
def get_routes(request):
    routes = [
        '/token',
        '/token/refresh'
    ]
    return Response(routes)

class NewTokenObtainPairView(TokenObtainPairView):
    serializer_class= NewTokenObtainPairSerializer
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    user = request.user
    profile = user.profile
    serializer = ProfileSerializer(profile, many=False)
    return Response(serializer.data)