from django.urls import path, include
from . import views

app_name = "event"
urlpatterns = [
  path("main/", views.index, name="index"),
  path("event/", views.eventpage, name="newevent"),
]