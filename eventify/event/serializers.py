from rest_framework import serializers
from . import models

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Event
        fields = ('id', 'name', 'description', 'start', 'end', 
                  'location', 'weather', 'budget', 'organizers', 'participants')
