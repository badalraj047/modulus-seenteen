import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { Task, TaskInput, SortOption } from '../types';
import {
  fetchTasks,
  createTaskRequest,
  updateTaskRequest,
  toggleTaskRequest,
  deleteTaskRequest,
} from '../api/tasks';
import { ApiError } from '../api/client';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  isMutating: boolean; // true during add/update/delete/toggle
  error: string | null;
  sortBy: SortOption;
}

type TaskAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; tasks: Task[] }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'MUTATE_START' }
  | { type: 'MUTATE_ERROR'; error: string }
  | { type: 'ADD_TASK'; task: Task }
  | { type: 'UPDATE_TASK'; task: Task }
  | { type: 'REMOVE_TASK'; id: string }
  | { type: 'SET_SORT'; sortBy: SortOption }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESET' };

const initialState: TaskState = {
  tasks: [],
  isLoading: false,
  isMutating: false,
  error: null,
  sortBy: 'smart',
};

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, isLoading: true, error: null };
    case 'LOAD_SUCCESS':
      return { ...state, isLoading: false, tasks: action.tasks };
    case 'LOAD_ERROR':
      return { ...state, isLoading: false, error: action.error };
    case 'MUTATE_START':
      return { ...state, isMutating: true, error: null };
    case 'MUTATE_ERROR':
      return { ...state, isMutating: false, error: action.error };
    case 'ADD_TASK':
      return { ...state, isMutating: false, tasks: [action.task, ...state.tasks] };
    case 'UPDATE_TASK':
      return {
        ...state,
        isMutating: false,
        tasks: state.tasks.map((t) => (t._id === action.task._id ? action.task : t)),
      };
    case 'REMOVE_TASK':
      return {
        ...state,
        isMutating: false,
        tasks: state.tasks.filter((t) => t._id !== action.id),
      };
    case 'SET_SORT':
      return { ...state, sortBy: action.sortBy };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface TaskContextValue extends TaskState {
  loadTasks: (sortBy?: SortOption) => Promise<void>;
  addTask: (input: TaskInput) => Promise<void>;
  editTask: (id: string, input: Partial<TaskInput>) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  setSortBy: (sortBy: SortOption) => void;
  clearError: () => void;
  reset: () => void;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const loadTasks = useCallback(
    async (sortBy?: SortOption) => {
      dispatch({ type: 'LOAD_START' });
      try {
        const effectiveSort = sortBy ?? state.sortBy;
        const tasks = await fetchTasks(effectiveSort);
        dispatch({ type: 'LOAD_SUCCESS', tasks });
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Failed to load tasks';
        dispatch({ type: 'LOAD_ERROR', error: message });
      }
    },
    [state.sortBy]
  );

  const addTask = useCallback(async (input: TaskInput) => {
    dispatch({ type: 'MUTATE_START' });
    try {
      const task = await createTaskRequest(input);
      dispatch({ type: 'ADD_TASK', task });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to create task';
      dispatch({ type: 'MUTATE_ERROR', error: message });
      throw err;
    }
  }, []);

  const editTask = useCallback(async (id: string, input: Partial<TaskInput>) => {
    dispatch({ type: 'MUTATE_START' });
    try {
      const task = await updateTaskRequest(id, input);
      dispatch({ type: 'UPDATE_TASK', task });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to update task';
      dispatch({ type: 'MUTATE_ERROR', error: message });
      throw err;
    }
  }, []);

  const toggleTask = useCallback(async (id: string) => {
    // Optimistic-ish: we still await the server, but keep it snappy since it's a single field flip.
    try {
      const task = await toggleTaskRequest(id);
      dispatch({ type: 'UPDATE_TASK', task });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to update task';
      dispatch({ type: 'MUTATE_ERROR', error: message });
      throw err;
    }
  }, []);

  const removeTask = useCallback(async (id: string) => {
    dispatch({ type: 'MUTATE_START' });
    try {
      await deleteTaskRequest(id);
      dispatch({ type: 'REMOVE_TASK', id });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to delete task';
      dispatch({ type: 'MUTATE_ERROR', error: message });
      throw err;
    }
  }, []);

  const setSortBy = useCallback((sortBy: SortOption) => {
    dispatch({ type: 'SET_SORT', sortBy });
  }, []);

  const clearError = useCallback(() => dispatch({ type: 'CLEAR_ERROR' }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  return (
    <TaskContext.Provider
      value={{
        ...state,
        loadTasks,
        addTask,
        editTask,
        toggleTask,
        removeTask,
        setSortBy,
        clearError,
        reset,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks(): TaskContextValue {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within a TaskProvider');
  return ctx;
}
