# Generated by Django 4.2.3 on 2023-07-20 17:30

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("tasks", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="todoitem",
            name="is_deleted",
            field=models.BooleanField(default=False),
        ),
    ]
