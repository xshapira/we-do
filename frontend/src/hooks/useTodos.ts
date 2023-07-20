import { useState, useEffect } from "react";
import { ITodo } from "../types/todo";

export const useTodos = () => {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  const fetchCsrfToken = async () => {
    try {
      const response = await fetch("/csrf/", {
        credentials: "include",
      });
      const data = await response.json();
      setCsrfToken(data.csrfToken);
    } catch (error) {
      console.log("Error fetching CSRF token:", error);
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await fetch("/todos/");
      if (response.ok) {
        const data = await response.json();
        // Ensure that todos array contains valid todo objects with the id property
        const updatedTodos = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          completed: item.completed,
        }));
        setTodos(updatedTodos);
        setHasChanges(false);
      } else {
        throw new Error("Failed to fetch todos");
      }
    } catch (error) {
      console.log("Error fetching todos:", error);
    }
  };

  const addTodo = async (name: string): Promise<void> => {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (csrfToken) {
        headers["X-CSRFToken"] = csrfToken;
      }
      const response = await fetch("/todos/create/", {
        method: "POST",
        headers,
        body: JSON.stringify({ title: name }),
      });
      const data = await response.json();
      const newTodo: ITodo = {
        id: data.id,
        title: data.title, // Make sure the `data` object has the `title` property
        completed: data.completed,
      };
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      setHasChanges(true);
    } catch (error) {
      console.log("Error adding todo:", error);
    }
  };

  const updateTodos = (newTodos: ITodo[]) => {
    setTodos(newTodos);
    setHasChanges(true);
  };

  const saveChanges = async () => {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (csrfToken) {
        headers["X-CSRFToken"] = csrfToken;
      }
      const response = await fetch("/todos/", {
        method: "POST",
        headers,
        body: JSON.stringify(todos),
      });
      if (response.ok) {
        setHasChanges(false);
      } else {
        throw new Error("Failed to save changes");
      }
    } catch (error) {
      console.log("Error saving changes:", error);
    }
  };

  const undoChanges = () => {
    fetchTodos();
  };

  const toggleTodo = (id: number): void => {
    setTodos((prevState: ITodo[]) =>
      prevState.map((todo: ITodo) => {
        if (todo.id === id) {
          return {
            ...todo,
            completed: !todo.completed,
          };
        }
        return todo;
      })
    );
    setHasChanges(true);
  };

  const editTodo = (id: number, name: string): void => {
    setTodos((prevState: ITodo[]) => {
      return prevState.map((todo: ITodo) => {
        if (todo.id === id) {
          return {
            ...todo,
            name,
          };
        }
        return todo;
      });
    });
    setHasChanges(true);
  };

  const removeTodo = (id: number): void => {
    setTodos((prevState: ITodo[]) =>
      prevState.filter((todo: ITodo) => todo.id !== id)
    );
    setHasChanges(true);
  };

  const getItemsLeft = (): number => {
    return todos.reduce((counter: number, todo: ITodo) => {
      if (!todo.completed) {
        return counter + 1;
      }
      return counter;
    }, 0);
  };

  const removeCompleted = (): void => {
    setTodos((prevState: ITodo[]) =>
      prevState.filter((todo: ITodo) => !todo.completed)
    );
    setHasChanges(true);
  };

  useEffect(() => {
    fetchCsrfToken();
    fetchTodos();
  }, []);

  return {
    todos,
    addTodo,
    updateTodos,
    saveChanges,
    undoChanges,
    hasChanges,
    toggleTodo,
    editTodo,
    removeTodo,
    getItemsLeft,
    removeCompleted,
  };
};
