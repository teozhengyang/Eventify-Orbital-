from django.shortcuts import render
from rest_framework import viewsets
from .serializers import EventSerializer, UserSerializer, ProfileSerializer
from .models import Event, User
from django import forms
import calendar
from datetime import datetime
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth import login
from django.db import IntegrityError
# jwt imports
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import NewTokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated

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

# Potentially temporary while we create frontend + backend
class RegisterForm(forms.Form):
    username = forms.CharField(required=True, widget=forms.TextInput(attrs={'placeholder': 'Username'}))
    first_name = forms.CharField(required=True, widget=forms.TextInput(attrs={'placeholder': 'First Name'}))
    last_name = forms.CharField(required=True, widget=forms.TextInput(attrs={'placeholder': 'Last Name'}))
    email = forms.CharField(required=True, widget=forms.TextInput(attrs={'placeholder': 'Email'}))
    password = forms.CharField( required=True, widget=forms.PasswordInput(attrs={'placeholder': 'Password'}))
    confirm_password = forms.CharField(required=True, widget=forms.PasswordInput(attrs={'placeholder': 'Confirm Password'}))

# Potentially temporary while we create frontend + backend
class LoginForm(forms.Form):
    username = forms.CharField(required=True, widget=forms.TextInput(attrs={'placeholder': 'Username'}))
    password = forms.CharField(required=True, widget=forms.PasswordInput(attrs={'placeholder': 'Password'}))

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
  return HttpResponseRedirect(reverse("event:login"))

# register view
def register(request):
    # when user submit register form
    if request.method == "POST":
        # access username, email, pw user has typed in
        form = RegisterForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data["username"]
            email = form.cleaned_data["email"]
            first_name = form.cleaned_data["first_name"]
            last_name = form.cleaned_data["last_name"]
            password = form.cleaned_data["password"]
            confirm_password = form.cleaned_data["confirm_password"]
            # ensure both pw matches
            if password != confirm_password:
                return render(request, "event/error.html", {
                    "message": "Passwords must match."
                })
            # attempt to create new user
            try:
                user = User.objects.create_user(username, email, password, first_name, last_name)
                user.save()
            except IntegrityError:
                return render(request, "event/error.html", {
                    "message": "Username already taken."
                })
            # log user in if successful
            login(request, user)
            # return index page
            return HttpResponseRedirect(reverse("event:index"))
    else:
        # when new user want to register
        return render(request, "event/register.html", {
        "form": RegisterForm,
    })
        
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
