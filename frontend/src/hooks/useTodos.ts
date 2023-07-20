import { useState } from "react";
import { ITodo } from "../types/todo";

export const useTodos = () => {
  const [todos, setTodos] = useState<ITodo[]>([]);

  const addTodo = (name: string): void => {
    const newTodo: ITodo = {
      id: Date.now(),
      name,
      completed: false,
    };
    setTodos((prevState: ITodo[]) => [...prevState, newTodo]);
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

  return {
    todos,
    addTodo,
    toggleTodo,
    editTodo,
    removeTodo,
    getItemsLeft,
    removeCompleted,
  };
};
