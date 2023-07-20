from django.urls import path

from tasks.views import TodoCreateView, TodoDeleteView, TodoListView

app_name = "tasks"

urlpatterns = [
    path("todos/", TodoListView.as_view()),
    path("todos/create/", TodoCreateView.as_view()),
    path("todos/<int:todo_id>/delete/", TodoDeleteView.as_view()),
]
