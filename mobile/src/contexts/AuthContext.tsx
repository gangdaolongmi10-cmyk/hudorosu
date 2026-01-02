import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../config/api';
import { getCurrentUser, updateUser as updateUserApi } from '../services/userService';

export interface User {
  id: number;
  email: string;
  role: string;
  name?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');
        
        if (storedToken) {
          setToken(storedToken);
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (e) {
              console.error('Failed to parse stored user:', e);
            }
          }
        }
      } catch (error) {
        console.error('Error loading stored auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  // ログイン処理
  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/admin/login', {
        email,
        password,
      });

      const { token: newToken, user: newUser } = response.data;
      
      setToken(newToken);
      setUser(newUser);

      await AsyncStorage.setItem('token', newToken);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.error || 'ログインに失敗しました');
      } else {
        throw new Error('ネットワークエラーが発生しました');
      }
    }
  };

  // 新規登録処理
  const register = async (email: string, password: string, name?: string) => {
    try {
      const response = await apiClient.post('/admin/users/create', {
        email,
        password,
        name: name || undefined,
      });

      // 登録成功後、自動的にログイン
      await login(email, password);
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.error || 'ユーザー登録に失敗しました');
      } else {
        throw new Error('ネットワークエラーが発生しました');
      }
    }
  };

  // ログアウト処理
  const logout = async () => {
    try {
      setToken(null);
      setUser(null);
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // ユーザー情報を更新
  const updateUser = async (userData: Partial<User>) => {
    try {
      const updatedUser = await updateUserApi(userData);
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.error || 'ユーザー情報の更新に失敗しました');
      } else {
        throw new Error('ネットワークエラーが発生しました');
      }
    }
  };

  // ユーザー情報を再取得
  const refreshUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      await AsyncStorage.setItem('user', JSON.stringify(currentUser));
    } catch (error: any) {
      console.error('Error refreshing user:', error);
      throw error;
    }
  };

  const isAuthenticated = Boolean(token && user);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading: Boolean(isLoading),
        login,
        register,
        logout,
        updateUser,
        refreshUser,
        isAuthenticated: Boolean(isAuthenticated),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

