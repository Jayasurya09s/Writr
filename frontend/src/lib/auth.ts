import { authAPI } from "@/services/api";

export interface User {
  id: string;
  name?: string;
  full_name?: string;
  email: string;
  avatar?: string;
}

const TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "current_user";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getUser(): User | null {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

// Alias for compatibility
export const getCurrentUser = getUser;

export function setToken(token: string, refreshToken: string, user: User): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  const token = getToken();
  return !!token;
}

export async function register(
  full_name: string,
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await authAPI.signup(email, password, full_name);
    const { access_token, refresh_token, user } = response.data;
    setToken(access_token, refresh_token, user);
    return { success: true };
  } catch (error: any) {
    const errorMsg = error.response?.data?.detail || "Registration failed";
    return { success: false, error: errorMsg };
  }
}

export async function login(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await authAPI.login(email, password);
    const { access_token, refresh_token, user } = response.data;
    setToken(access_token, refresh_token, user);
    return { success: true };
  } catch (error: any) {
    const errorMsg = error.response?.data?.detail || "Login failed";
    return { success: false, error: errorMsg };
  }
}

export function logout(): void {
  clearAuth();
}
