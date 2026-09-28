import { apiRequest } from './client';
import { Task, TaskInput, SortOption } from '../types';

export function fetchTasks(sortBy: SortOption = 'smart') {
  return apiRequest<Task[]>(`/tasks?sortBy=${sortBy}`);
}

export function createTaskRequest(input: TaskInput) {
  return apiRequest<Task>('/tasks', { method: 'POST', body: input });
}

export function updateTaskRequest(id: string, input: Partial<TaskInput>) {
  return apiRequest<Task>(`/tasks/${id}`, { method: 'PUT', body: input });
}

export function toggleTaskRequest(id: string) {
  return apiRequest<Task>(`/tasks/${id}/toggle`, { method: 'PATCH' });
}

export function deleteTaskRequest(id: string) {
  return apiRequest<{ message: string; _id: string }>(`/tasks/${id}`, { method: 'DELETE' });
}
