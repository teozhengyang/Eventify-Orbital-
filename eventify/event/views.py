from django import forms
from django.shortcuts import render
import calendar
from datetime import datetime
from .models import Event, Activities


class NewEventForm(forms.Form):
  event = forms.CharField(label="Event Name")
  start = forms.DateField(label="Start Date")
  end = forms.DateField(label="End Date")

# Create your views here.
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
  

