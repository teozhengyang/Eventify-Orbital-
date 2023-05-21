from django.urls import path, include
from . import views

app_name = "event"
urlpatterns = [
  path("main/", views.index, name="index"),
  # login, logout, register paths
  path("login/", views.login_user, name="login"),
  path("logout/", views.logout_user, name="logout"),
  path("register/", views.register, name="register"),
  path("event/", views.eventpage, name="newevent"),
  
]