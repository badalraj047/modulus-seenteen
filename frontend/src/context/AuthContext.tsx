import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { User } from '../types';
import { loginRequest, registerRequest } from '../api/auth';
import { saveSession, getToken, getStoredUser, clearSession } from '../api/storage';
import { ApiError } from '../api/client';

interface AuthState {
  user: User | null;
  isLoading: boolean; // true while checking for a persisted session on app start
  isSubmitting: boolean; // true while a login/register request is in flight
  error: string | null;
}

type AuthAction =
  | { type: 'BOOT_COMPLETE'; user: User | null }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS'; user: User }
  | { type: 'SUBMIT_DONE' }
  | { type: 'SUBMIT_ERROR'; error: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isSubmitting: false,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'BOOT_COMPLETE':
      return { ...state, user: action.user, isLoading: false };
    case 'SUBMIT_START':
      return { ...state, isSubmitting: true, error: null };
    case 'SUBMIT_SUCCESS':
      return { ...state, isSubmitting: false, user: action.user, error: null };
    case 'SUBMIT_DONE':
      return { ...state, isSubmitting: false, error: null };
    case 'SUBMIT_ERROR':
      return { ...state, isSubmitting: false, error: action.error };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({
  children,
  onLogout,
}: {
  children: React.ReactNode;
  onLogout?: () => void;
}) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // On app start, check AsyncStorage for a previously saved session so the
  // user doesn't have to log in again every time they open the app.
  useEffect(() => {
    (async () => {
      const token = await getToken();
      const user = token ? await getStoredUser() : null;
      dispatch({ type: 'BOOT_COMPLETE', user });
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'SUBMIT_START' });
    try {
      const res = await loginRequest(email, password);
      const user: User = { _id: res._id, name: res.name, email: res.email };
      await saveSession(res.token, user);
      dispatch({ type: 'SUBMIT_SUCCESS', user });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Login failed. Please try again.';
      dispatch({ type: 'SUBMIT_ERROR', error: message });
      throw err;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    dispatch({ type: 'SUBMIT_START' });
    try {
      await registerRequest(name, email, password);
      dispatch({ type: 'SUBMIT_DONE' });
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Registration failed. Please try again.';
      dispatch({ type: 'SUBMIT_ERROR', error: message });
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    await clearSession();
    dispatch({ type: 'LOGOUT' });
    onLogout?.();
  }, [onLogout]);

  const clearError = useCallback(() => dispatch({ type: 'CLEAR_ERROR' }), []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
