import { useState, useEffect } from "react";
import { ITodo } from "../types/todo";

export const useTodos = () => {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [previousTodos, setPreviousTodos] = useState<ITodo[][]>([]);

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
        // Filter out the deleted todo items
        const updatedTodos = data.filter((item: any) => !item.is_deleted);

        // Ensure that todos array contains valid todo objects with the id property
        const mappedTodos = updatedTodos.map((item: any) => ({
          id: item.id,
          title: item.title,
          completed: item.completed,
        }));

        setTodos(mappedTodos);
        setHasChanges(false);

        // Save the previous todos state
        // Save the previous todos state
        setPreviousTodos((prevTodos) => [...prevTodos, mappedTodos]);
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

      if (data.id && data.title && typeof data.completed === "boolean") {
        const newTodo: ITodo = {
          id: data.id,
          title: data.title,
          completed: data.completed,
          is_deleted: false,
        };
        setTodos((prevTodos) => [...prevTodos, newTodo]);
        setHasChanges(true);
      } else {
        throw new Error("Invalid server response");
      }
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
    if (previousTodos.length > 1) {
      // Check if there is a previous state to restore
      const previousState = previousTodos[previousTodos.length - 2]; // Retrieve the second last state
      setTodos([...previousState]);
      setPreviousTodos((prevTodos) => prevTodos.slice(0, prevTodos.length - 1)); // Remove the last state from the history
      setHasChanges(true);
    }
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
            title: name, // Update the title property instead of name
          };
        }
        return todo;
      });
    });
    setHasChanges(true);
  };

  const removeTodo = (id: number): void => {
    setTodos((prevState: ITodo[]) =>
      prevState.map((todo: ITodo) => {
        if (todo.id === id) {
          return {
            ...todo,
            is_deleted: true,
          };
        }
        return todo;
      })
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
      prevState.map((todo: ITodo) => {
        if (todo.completed) {
          return {
            ...todo,
            is_deleted: true,
          };
        }
        return todo;
      })
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
