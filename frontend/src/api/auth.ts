import { apiRequest } from './client';
import { AuthResponse } from '../types';

export function registerRequest(name: string, email: string, password: string) {
  return apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: { name, email, password },
    auth: false,
  });
}

export function loginRequest(email: string, password: string) {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });
}
