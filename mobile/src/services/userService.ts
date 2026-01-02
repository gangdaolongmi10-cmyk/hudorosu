import apiClient from '../config/api';

export interface User {
  id: number;
  email: string;
  name?: string;
  role: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * 現在のユーザー情報を取得
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>('/admin/settings/me');
  return response.data;
};

/**
 * ユーザー情報を更新
 */
export const updateUser = async (data: {
  name?: string;
  email?: string;
  avatar_url?: string;
}): Promise<User> => {
  const response = await apiClient.put<User>('/admin/settings/me', data);
  return response.data;
};

/**
 * パスワードを変更
 */
export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ message: string }> => {
  const response = await apiClient.put<{ message: string }>('/admin/settings/password', data);
  return response.data;
};

