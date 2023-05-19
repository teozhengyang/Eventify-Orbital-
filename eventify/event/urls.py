from django.urls import path
from datetime import datetime
from . import views

app_name = "event"
urlpatterns = [
  path("", views.index, name="index"),
  path("event", views.eventpage, name="newevent")
]