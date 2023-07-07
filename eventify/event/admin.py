from django.contrib import admin
from . import models

# display User in admin interface
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "budget", "first_name", "last_name")

class EventAdmin(admin.ModelAdmin):
    list_display = [f.name for f in models.Event._meta.fields]    
    
class ActivityAdmin(admin.ModelAdmin):
    list_display = [f.name for f in models.Activity._meta.fields]

# Register your models here.
admin.site.register(models.User, UserAdmin)
admin.site.register(models.Event, EventAdmin)
admin.site.register(models.Activity, ActivityAdmin)
