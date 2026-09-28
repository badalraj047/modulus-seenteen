import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

// Keys used in AsyncStorage. Namespacing avoids collisions with any other stored data.
const TOKEN_KEY = '@todo_app/token';
const USER_KEY = '@todo_app/user';

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
