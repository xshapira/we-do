import { useState } from "react";
import { ITodo } from "../types/todo";

export const useTodos = () => {
  const [todos, setTodos] = useState<ITodo[]>([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch("/tasks/todos/");
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.log("Error fetching todos:", error);
    }
  };

  const addTodo = async (name: string): Promise<void> => {
    try {
      const response = await fetch("/tasks/todos/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: name }),
      });
      const data = await response.json();
      setTodos((prevTodos) => [...prevTodos, data]);
    } catch (error) {
      console.log("Error adding todo:", error);
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
  };

  const removeTodo = (id: number): void => {
    setTodos((prevState: ITodo[]) =>
      prevState.filter((todo: ITodo) => todo.id !== id)
    );
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
  };

  const updateTodos = (newTodos: ITodo[]): void => {
    setTodos(newTodos);
  };

  return {
    todos,
    addTodo,
    toggleTodo,
    editTodo,
    removeTodo,
    getItemsLeft,
    removeCompleted,
    updateTodos,
  };
};
