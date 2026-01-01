import apiClient from '@/utils/axiosConfig';
import { User, UserResponse } from '@/types/user';

/**
 * 現在のユーザー情報を取得する
 * @returns ユーザー情報
 */
export const getCurrentUser = async (): Promise<User> => {
    const response = await apiClient.get<UserResponse>('/admin/settings/me');
    return response.data;
};

/**
 * ユーザー情報を更新する
 * @param data 更新するユーザー情報
 * @returns 更新されたユーザー情報
 */
export const updateUser = async (data: { name?: string; email?: string }): Promise<User> => {
    const response = await apiClient.put<UserResponse>('/admin/settings/me', data);
    return response.data;
};

/**
 * パスワードを変更する
 * @param currentPassword 現在のパスワード
 * @param newPassword 新しいパスワード
 */
export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    await apiClient.put('/admin/settings/password', {
        currentPassword,
        newPassword,
    });
};

