import apiClient from '@/utils/axiosConfig';
import { User, UserResponse } from '@/types/user';
import { buildImageUrl } from '@shared';

/**
 * 画像をアップロードする
 * @param file アップロードする画像ファイル
 * @returns アップロードされた画像のURL
 */
export const uploadAvatar = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await apiClient.post<{ url: string; filename: string; message: string }>('/admin/upload/avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    const baseUrl = apiClient.defaults.baseURL || '';
    return buildImageUrl(response.data.url, baseUrl);
};

/**
 * ユーザー一覧を取得する
 * @returns ユーザーの配列
 */
export const fetchUsers = async (): Promise<User[]> => {
    const response = await apiClient.get<UserResponse[]>('/admin/users/list');
    const baseUrl = apiClient.defaults.baseURL || '';
    return response.data.map(user => ({
        ...user,
        avatar_url: user.avatar_url ? buildImageUrl(user.avatar_url, baseUrl) : null
    }));
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
    const baseUrl = apiClient.defaults.baseURL || '';
    return {
        ...response.data,
        avatar_url: response.data.avatar_url ? buildImageUrl(response.data.avatar_url, baseUrl) : null
    };
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
    avatar_url?: string | null;
}): Promise<User> => {
    const response = await apiClient.put<UserResponse>(`/admin/users/${id}`, data);
    const baseUrl = apiClient.defaults.baseURL || '';
    return {
        ...response.data,
        avatar_url: response.data.avatar_url ? buildImageUrl(response.data.avatar_url, baseUrl) : null
    };
};

/**
 * ユーザーを削除する
 * @param id ユーザーID
 */
export const deleteUser = async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/users/${id}`);
};
