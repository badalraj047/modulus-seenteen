import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Task } from '../types';

const TOKEN_KEY = '@todo_app/token';
const USER_KEY = '@todo_app/user';
const TASKS_CACHE_KEY = '@todo_app/tasks_cache';

export async function saveSession(token: string, user: User): Promise<void> {
  await AsyncStorage.multiSet([
    [TOKEN_KEY, token],
    [USER_KEY, JSON.stringify(user)],
  ]);
}

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function getStoredUser(): Promise<User | null> {
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
}

export async function cacheTasks(tasks: Task[]): Promise<void> {
  try {
    await AsyncStorage.setItem(TASKS_CACHE_KEY, JSON.stringify(tasks));
  } catch {}
}

export async function getCachedTasks(): Promise<Task[] | null> {
  try {
    const raw = await AsyncStorage.getItem(TASKS_CACHE_KEY);
    return raw ? (JSON.parse(raw) as Task[]) : null;
  } catch {
    return null;
  }
}
