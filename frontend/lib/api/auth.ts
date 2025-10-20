import apiClient from './client';

export interface NonceResponse {
  nonce: string;
}

export interface User {
  id: string;
  walletAddress: string;
  displayName?: string;
  email?: string;
  isOrganizer: boolean;
  createdAt: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export const authApi = {
  /**
   * Step 1: Get nonce for wallet address
   */
  getNonce: async (walletAddress: string): Promise<NonceResponse> => {
    const { data } = await apiClient.post<NonceResponse>('/auth/nonce', {
      walletAddress,
    });
    return data;
  },

  /**
   * Step 2: Verify signature and get JWT token
   */
  verify: async (payload: {
    walletAddress: string;
    signature: string;
    nonce: string;
  }): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>('/auth/verify', payload);
    return data;
  },

  /**
   * Get current authenticated user
   */
  me: async (): Promise<User> => {
    const { data } = await apiClient.get<User>('/auth/me');
    return data;
  },

  /**
   * Logout (clear local storage)
   */
  logout: () => {
    localStorage.removeItem('proofpass_token');
    localStorage.removeItem('proofpass_user');
    window.location.href = '/';
  },
};