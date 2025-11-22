import api from './api.service';
import { API_ENDPOINTS } from '@/config/api.config';

/**
 * Auth Service
 * Handles user authentication (register, login, logout)
 */

export interface User {
  id: string;
  name: string;
  email: string;
  location?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  location?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

/**
 * Register a new user
 */
export async function register(data: RegisterData): Promise<{ message: string }> {
  const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, data);
  return response.data;
}

/**
 * Login user
 */
export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
  
  // Store token and user in localStorage
  if (response.data.token) {
    localStorage.setItem('auth_token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
}

/**
 * Logout user
 */
export function logout(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('auth_token');
}

/**
 * Get auth token
 */
export function getToken(): string | null {
  return localStorage.getItem('auth_token');
}
