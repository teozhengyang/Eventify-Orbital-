from django.db import models

# Create your models here.
class MainEvent(models.Model):
    name = models.CharField(max_length=64)
    estart = models.DateTimeField()
    eend = models.DateTimeField()

    def __str__(self):
        return f"{self.name}"
    
    


class Activities(models.Model):
    name = models.CharField(max_length=64)
    astart = models.DateTimeField()
    aend = models.DateTimeField()
    event = models.ForeignKey(MainEvent, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.astart} to {self.aend}: {self.name}"