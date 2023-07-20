import { act, cleanup, renderHook } from "@testing-library/react-hooks";
import { useTodos } from "../hooks/useTodos";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe("useTodos tests", () => {
  it("should initialize with an empty todo list", () => {
    const { result } = renderHook(() => useTodos());

    expect(result.current.todos).toEqual([]);
  });

  it("should add a new todo", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("test");
    });
    console.log(result.current.todos);
    expect(result.current.todos).toEqual([
      {
        id: expect.any(Number),
        name: "test",
        completed: false,
      },
    ]);
  });
});
