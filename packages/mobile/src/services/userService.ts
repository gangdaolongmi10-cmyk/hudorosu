import apiClient from '../config/api';
import { buildImageUrl } from '@shared/utils/imagePath';

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

/**
 * 画像をアップロードする
 * @param uri 画像のURI（ローカルファイルパス）
 * @param type 画像のMIMEタイプ（例: 'image/jpeg'）
 * @param name ファイル名
 * @returns アップロードされた画像のURL
 */
export const uploadAvatar = async (uri: string, type: string = 'image/jpeg', name: string = 'avatar.jpg'): Promise<string> => {
  const formData = new FormData();
  
  // React Native用のFormData形式
  formData.append('avatar', {
    uri: uri,
    type: type,
    name: name,
  } as any);
  
  const response = await apiClient.post<{ url: string; filename: string; message: string }>('/admin/upload/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  // フルURLを返す（共通のユーティリティ関数を使用）
  const baseUrl = apiClient.defaults.baseURL || '';
  return buildImageUrl(response.data.url, baseUrl);
};

