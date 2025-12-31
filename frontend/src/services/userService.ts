import apiClient from '@/utils/axiosConfig';
import { User, UserResponse } from '@/types/user';

/**
 * ユーザー一覧を取得する
 * @returns ユーザーの配列
 */
export const fetchUsers = async (): Promise<User[]> => {
    const response = await apiClient.get<UserResponse[]>('/admin/users/list');
    return response.data;
};

