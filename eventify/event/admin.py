from django.contrib import admin
from . import models

# display User in admin interface
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "budget", "first_name", "last_name")

# Register your models here.
admin.site.register(models.User, UserAdmin)
admin.site.register(models.Event)
admin.site.register(models.Activities)
admin.site.register(models.Profile)