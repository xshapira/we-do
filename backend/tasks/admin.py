from django.contrib import admin

from tasks.models import TodoItem


@admin.register(TodoItem)
class TodoItemAdmin(admin.ModelAdmin):
    list_display = ("__str__",)
