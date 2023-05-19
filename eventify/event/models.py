from django.db import models
import datetime

# Create your models here.
class MainEvent(models.Model):
    name = models.CharField(max_length=64)
    estart = models.DateField(default=datetime.date.today)
    eend = models.DateField(default=datetime.date.today)

    def __str__(self):
        return f"{self.name}"
    
    


class Activities(models.Model):
    name = models.CharField(max_length=64)
    date = models.DateField(default=datetime.date.today)
    astart = models.DateTimeField(default=datetime.datetime.now)
    aend = models.DateTimeField(default=datetime.datetime.now)
    event = models.ForeignKey(MainEvent, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.astart} to {self.aend}: {self.name}"