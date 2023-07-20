from django.urls import path

from tasks.views import (
    TodoCreateView,
    TodoDeleteView,
    TodoListView,
    TodoUndoChangesView,
    TodoUndoDeleteView,
    TodoUpdateView,
)

app_name = "tasks"

urlpatterns = [
    path("todos/", TodoListView.as_view()),
    path("todos/create/", TodoCreateView.as_view()),
    path("todos/<int:todo_id>/delete/", TodoDeleteView.as_view()),
    path("todos/<int:todo_id>/undo-delete/", TodoUndoDeleteView.as_view()),
    path("todos/<int:todo_id>/update/", TodoUpdateView.as_view()),
    path("todos/undo-changes/", TodoUndoChangesView.as_view()),
]
