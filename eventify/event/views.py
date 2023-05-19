from django.shortcuts import render
import calendar
from datetime import datetime
from .models import MainEvent, Activities

# Create your views here.
def index(request):
  num = calendar.monthrange(datetime.now().year, datetime.now().month)[1]
  days = list(range(1, num))
  
  return render(request, "event/index.html", {
    "days": days,
    "eventday": num 
  })

def eventpage(request):
  return render(request, "event/newevent.html")
