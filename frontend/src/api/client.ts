import { API_BASE_URL } from './config';
import { getToken } from './storage';
import { ApiErrorResponse } from '../types';

// Custom error class so calling code can distinguish API errors from network/JS errors
// and display the backend's actual validation message to the user.
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  auth?: boolean; // whether to attach the Authorization header (default true)
}

// Central fetch wrapper: builds headers, attaches JWT, parses JSON, and turns
// non-2xx responses into thrown ApiError instances with the server's message.
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token = await getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      'Could not reach the server. Check your connection or the API URL in src/api/config.ts',
      0
    );
  }

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const errData = data as ApiErrorResponse | null;
    throw new ApiError(errData?.message || 'Something went wrong', response.status);
  }

  return data as T;
}
