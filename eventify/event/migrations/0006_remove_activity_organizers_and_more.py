# Generated by Django 4.2.1 on 2023-06-12 07:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0005_rename_activities_activity'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='activity',
            name='organizers',
        ),
        migrations.RemoveField(
            model_name='activity',
            name='participants',
        ),
        migrations.DeleteModel(
            name='Profile',
        ),
    ]
