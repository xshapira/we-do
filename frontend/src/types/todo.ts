export interface ITodo {
  id: number;
  name: string;
  completed: boolean;
}

export enum Filter {
  active = "active",
  completed = "completed",
}

export const absurd = (_value: never): any => {};
