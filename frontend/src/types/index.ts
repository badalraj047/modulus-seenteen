// Central type definitions shared across the app.

export type Priority = 'low' | 'medium' | 'high';

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface AuthResponse extends User {
  token: string;
}

export interface Task {
  _id: string;
  user: string;
  title: string;
  description: string;
  dateTime: string; // ISO date string
  deadline: string; // ISO date string
  priority: Priority;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

// Shape used when creating or editing a task from the form.
export interface TaskInput {
  title: string;
  description: string;
  dateTime: string;
  deadline: string;
  priority: Priority;
}

export type SortOption = 'smart' | 'deadline' | 'priority';

// Root stack navigator param list - keeps navigation calls type-safe across the app.
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  TaskList: undefined;
  TaskForm: { taskId?: string } | undefined;
  TaskDetail: { taskId: string };
};

// API error shape returned by the backend's error middleware / express-validator.
export interface ApiErrorResponse {
  message: string;
  errors?: Array<{ msg: string; path?: string }>;
}
