import json

from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views import View

from tasks.models import TodoItem


class TodoListView(View):
    def get(self, request):
        todos = TodoItem.objects.filter(is_deleted=False)
        list_of_todos = [
            {"id": todo.id, "title": todo.title, "completed": todo.completed}
            for todo in todos
        ]
        return JsonResponse(list_of_todos, safe=False)


class TodoCreateView(View):
    def post(self, request):
        data = json.loads(request.body)
        if title := data.get("title"):
            todo = TodoItem.objects.create(title=title, completed=False)
            return JsonResponse(
                {"id": todo.id, "title": todo.title, "completed": todo.completed},
                status=201,
            )
        return JsonResponse(
            {"error": "Please provide a title for the to-do item"}, status=400
        )


class TodoDeleteView(View):
    def delete(self, request, todo_id):
        try:
            todo = TodoItem.objects.get(id=todo_id)
            todo.is_deleted = True
            todo.save()
            return JsonResponse({}, status=204)
        except TodoItem.DoesNotExist:
            return JsonResponse({"error": "Todo item does not exist"}, status=404)


class TodoUpdateView(View):
    def put(self, request, todo_id):
        data = json.loads(request.body)
        if title := data.get("title"):
            try:
                todo = TodoItem.objects.get(id=todo_id)
                todo.title = title
                todo.save()
                return JsonResponse(
                    {"id": todo.id, "title": todo.title, "completed": todo.completed},
                    status=200,
                )
            except TodoItem.DoesNotExist:
                return JsonResponse({"error": "Todo item does not exist"}, status=404)
        return JsonResponse(
            {"error": "Please provide a title for the to-do item"}, status=400
        )


class TodoUndoChangesView(View):
    def post(self, request):
        todos = TodoItem.objects.values()
        return JsonResponse(list(todos), safe=False)


def csrf(request):
    return JsonResponse({"csrfToken": get_token(request)})


def ping(request):
    return JsonResponse({"result": "OK"})
