import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import * as React from "react";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { Filter, ITodo, absurd } from "../types/todo";
import { Container, Button } from "@mui/material";
import { TodoItem } from "./TodoItem";
import styled from "styled-components";
import { useTodos } from "../hooks/useTodos";

// Helper function to reorder todo items
const reorder = (
  list: ITodo[],
  startIndex: number,
  endIndex: number
): ITodo[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const TodoList: FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState("");
  const [filter, setFilter] = useState<Filter>(Filter.active);

  const {
    todos,
    addTodo,
    toggleTodo,
    editTodo,
    removeTodo,
    removeCompleted,
    getItemsLeft,
    updateTodos,
    hasChanges, // <-- Add hasChanges state from useTodos hook
    undoChanges, // <-- Add undoChanges function from useTodos hook
  } = useTodos();

  const itemsLeft = getItemsLeft();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setValue(event.target.value);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.key === "Enter" && value.trim() !== "") {
      addTodo(value);
      setValue("");
    }
  };

  const handleChangeFilter = (filter: Filter) => {
    setFilter(filter);
  };

  const filteredTodos = useMemo(
    () =>
      todos.filter((todo) => {
        switch (filter) {
          case Filter.active:
            return !todo.completed;
          case Filter.completed:
            return todo.completed;
          default:
            return absurd(filter);
        }
      }),
    [todos, filter]
  );

  // Handler function for when the dragging ends
  const onDragEnd = (result: DropResult) => {
    // If dropped outside the list, do nothing
    if (!result.destination) {
      return;
    }

    const items = reorder(todos, result.source.index, result.destination.index);

    // Set the new todo state
    updateTodos(items);
  };

  const filterButtons = Object.values(Filter).map((f) => (
    <FilterButton
      key={f}
      onClick={() => handleChangeFilter(f)}
      $isActive={f === filter}
    >
      {f}
    </FilterButton>
  ));

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleUndoChanges = async () => {
    try {
      await undoChanges();
    } catch (error) {
      console.log("Error undoing changes:", error);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <TodoListContainer
            {...provided.droppableProps}
            ref={provided.innerRef}
            sx={{ display: "flex" }}
            maxWidth="sm"
          >
            <Input
              placeholder="What needs to be done?"
              value={value}
              onKeyDown={handleKeyDown}
              onChange={handleChange}
              ref={inputRef}
            />
            {filteredTodos &&
              filteredTodos.map((todo: ITodo, index: number) => (
                <Draggable
                  key={todo.id}
                  draggableId={todo.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TodoItem
                        toggleTodo={toggleTodo}
                        editTodo={editTodo}
                        removeTodo={removeTodo}
                        key={todo.id}
                        id={todo.id}
                        name={todo.name}
                        completed={todo.completed}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
            <TodoFooter>
              <ItemsLeft>{itemsLeft} item(s) left</ItemsLeft>
              <FilterButtons>{filterButtons}</FilterButtons>
              <ClearButton
                $isActive={false}
                $isVisible={filter === Filter.active ? false : true}
                onClick={removeCompleted}
              >
                Clear Completed
              </ClearButton>
              {hasChanges && (
                <UndoButton variant="outlined" onClick={handleUndoChanges}>
                  Undo Changes
                </UndoButton>
              )}
            </TodoFooter>
          </TodoListContainer>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const TodoListContainer = styled(Container)`
  margin: 0 auto;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  background-color: ${(props) => props.theme.colors.secondary};
  min-height: 432px;
  display: flex;
  flex-direction: column;
  height: 100%;

  /* Add flex-grow and overflow properties */
  flex-grow: 1;
  overflow: auto;
`;

const TodoFooter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;

  /* Add margin-top: auto to push the footer to the bottom */
  margin-top: auto;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.text}; /* Add text color */
  margin-bottom: 16px;
`;

const ItemsLeft = styled.span`
  font-size: 14px;
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const FilterButton = styled(Button)<{ $isActive: boolean }>`
  && {
    background-color: transparent;
    color: ${(props) => (props.$isActive ? "orange" : props.theme.colors.text)};
    border: ${(props) => (props.$isActive ? `1px solid orange` : "none")};
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 14px;
    text-transform: capitalize;
    &:hover {
      background-color: ${(props) => props.theme.colors.primary};
      color: ${(props) => props.theme.colors.background};
    }
  }
`;

const ClearButton = styled(Button)<{ $isActive: boolean; $isVisible: boolean }>`
  && {
    background-color: ${(props) =>
      props.$isActive ? props.theme.colors.primary : "transparent"};
    color: ${(props) =>
      props.$isActive
        ? props.theme.colors.background
        : props.theme.colors.text};
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 14px;
    text-transform: capitalize;
    display: ${(props) => (props.$isVisible ? "block" : "none")};
    &:hover {
      background-color: ${(props) => props.theme.colors.primary};
      color: ${(props) => props.theme.colors.background};
    }
  }
`;

const UndoButton = styled(Button)`
  && {
    background-color: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.background};
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 14px;
    text-transform: capitalize;
    margin-left: 8px;
    &:hover {
      background-color: ${(props) => props.theme.colors.primary};
    }
  }
`;
