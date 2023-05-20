from django.shortcuts import render
from rest_framework import viewsets
from .serializers import EventSerializer
from .models import Event

from django import forms
import calendar
from datetime import datetime

# View for event
class EventView(viewsets.ModelViewSet):
  queryset = Event.objects.all()
  serializer_class = EventSerializer



# Potentially temporary while we create frontend + backend
class NewEventForm(forms.Form):
  event = forms.CharField(label="Event Name")
  start = forms.DateField(label="Start Date")
  end = forms.DateField(label="End Date")


def index(request):
  currdate = datetime.now()
  month = calendar.Calendar().monthdatescalendar(currdate.year, currdate.month)

  return render(request, "event/index.html", {
    "month": month,
    "head": currdate.strftime("%B %Y")
  })

def eventpage(request):
  return render(request, "event/newevent.html", {
    "form": NewEventForm()
  })
  

