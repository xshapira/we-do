export interface ITodo {
  id: number;
  title: string;
  completed: boolean;
  is_deleted: boolean;
}

export enum Filter {
  active = "active",
  completed = "completed",
}

export const absurd = (_value: never): any => {};
