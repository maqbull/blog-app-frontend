import { apiClient } from './apiClient';

interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name?: string;
    picture?: string;
  };
}

export const authService = {
  async loginWithGoogle(token: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/google', { token }, { requiresAuth: false });
  },

  async loginWithFacebook(token: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/facebook', { token }, { requiresAuth: false });
  },

  async validateToken(): Promise<AuthResponse> {
    return apiClient.get<AuthResponse>('/auth/validate');
  }
}; 