import { apiFetch } from './api';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    fullName: string;
    role: 'ADMIN' | 'STUDENT';
    phone?: string;
    department?: string;
    active: boolean;
  };
}

interface RegisterData {
  username: string;
  password: string;
  email: string;
  fullName: string;
  phone?: string;
  department?: string;
}

export const authService = {
  login: (username: string, password: string): Promise<LoginResponse> =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  registerStudent: (data: RegisterData): Promise<LoginResponse> =>
    apiFetch('/auth/register/student', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  registerAdmin: (data: RegisterData): Promise<LoginResponse> =>
    apiFetch('/auth/register/admin', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getCurrentUser: (): Promise<LoginResponse['user']> =>
    apiFetch('/auth/me'),
};
