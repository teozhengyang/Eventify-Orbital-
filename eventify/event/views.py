from django.shortcuts import render
from rest_framework import viewsets
from .serializers import EventSerializer, UserSerializer
from .models import Event, User
from django import forms
import calendar
from datetime import datetime
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError

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

# login view
def login_user(request):
    # when user submit login form
    if request.method == "POST":
        # access username and pw user has typed in
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data["username"]
            password = form.cleaned_data["password"]
            # attempt to sign user in
            user = authenticate(request, username=username, password=password)
            # check if authentication successful
            if user is not None:
                login(request, user)
                return HttpResponseRedirect(reverse("event:index"))
            else: 
                return render(request, "event/error.html", {
                    "message": "Invalid username and/or password"
                })
    # when user want to login
    else:
        return render(request, "event/login.html", {
        "form": LoginForm,
    })

# logout view
def logout_user(request):
    logout(request)
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
            password = form.cleaned_data["password"]
            confirm_password = form.cleaned_data["confirm_password"]
            # ensure both pw matches
            if password != confirm_password:
                return render(request, "event/error.html", {
                    "message": "Passwords must match."
                })
            # attempt to create new user
            try:
                user = User.objects.create_user(username, email, password)
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
  
  
