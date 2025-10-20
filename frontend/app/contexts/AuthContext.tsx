// frontend/src/app/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, User } from '@/lib/api/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('proofpass_token');
        const cachedUser = localStorage.getItem('proofpass_user');

        if (token) {
          if (cachedUser) {
            // Use cached user immediately
            setUser(JSON.parse(cachedUser));
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('proofpass_token', token);
    localStorage.setItem('proofpass_user', JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('proofpass_token');
    localStorage.removeItem('proofpass_user');
    setUser(null);
    window.location.href = '/';
  };

  const refetchUser = async () => {
    try {
      const freshUser = await authApi.me();
      setUser(freshUser);
      localStorage.setItem('proofpass_user', JSON.stringify(freshUser));
    } catch (error) {
      console.error('Failed to refetch user:', error);
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}