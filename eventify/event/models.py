from django.db import models
from datetime import datetime
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    budget = models.FloatField(default=0)
    def __str__(self):
        return f"{self.username}"

class MainEvent(models.Model):
    name = models.CharField(max_length=64)
    estart = models.DateTimeField()
    eend = models.DateTimeField()

    def __str__(self):
        return f"{self.name}"
    

class Activities(models.Model):
    name = models.CharField(max_length=64)
    date = models.DateField(default=datetime.date.today)
    astart = models.DateTimeField(default=datetime.datetime.now)
    aend = models.DateTimeField(default=datetime.datetime.now)
    event = models.ForeignKey(MainEvent, on_delete=models.CASCADE)
    description = models.TextField(blank=True)
    location = models.TextField(blank=True)
    weather = models.TextField(blank=True)
    budget = models.FloatField(default=0)
    organizers = models.ManyToManyField(User, related_name='organized_activities')
    participants = models.ManyToManyField(User, related_name='participated_activities', blank=True)

    def __str__(self):
        return f"{self.astart} to {self.aend}: {self.name}"
    
    
