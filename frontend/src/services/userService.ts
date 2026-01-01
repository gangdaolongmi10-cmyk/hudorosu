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

/**
 * 新規ユーザーを作成する
 * @param data ユーザー作成データ
 * @returns 作成されたユーザー情報
 */
export const createUser = async (data: {
    email: string;
    password: string;
    name?: string;
    role?: string;
}): Promise<User> => {
    const response = await apiClient.post<UserResponse>('/admin/users/create', data);
    return response.data;
};

/**
 * ユーザー情報を更新する
 * @param id ユーザーID
 * @param data 更新するユーザー情報
 * @returns 更新されたユーザー情報
 */
export const updateUser = async (id: number, data: {
    email?: string;
    name?: string;
    role?: string;
    password?: string;
}): Promise<User> => {
    const response = await apiClient.put<UserResponse>(`/admin/users/${id}`, data);
    return response.data;
};

/**
 * ユーザーを削除する
 * @param id ユーザーID
 */
export const deleteUser = async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/users/${id}`);
};

