// src/services/authService.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000';

interface User {
  user_id: string;
  email: string;
  name: string;
}

interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
};

export const signup = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): Promise<User> => {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_URL}/api/auth/signup`,
      {
        name,
        email,
        password,
        confirmPassword,
      }
    );

    const { token, user } = response.data;
    setAuthToken(token);

    return user;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

export const login = async (email: string, password: string): Promise<User> => {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_URL}/api/auth/login`,
      {
        email,
        password,
      }
    );

    const { token, user } = response.data;
    console.log(user);
    console.log(token);
    setAuthToken(token);

    return user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await axios.post(`${API_URL}/api/auth/logout`);
    setAuthToken(null);
  } catch (error) {
    console.error("Logout error:", error);
    setAuthToken(null);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    setAuthToken(token);
    const response = await axios.get<User>(`${API_URL}/api/auth/me`);
    return response.data;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('token') !== null;
};