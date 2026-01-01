import apiClient from '@/utils/axiosConfig';

export interface StatsResponse {
    totalCategories: number;
    totalFoods: number;
}

/**
 * 統計情報を取得する
 * @returns 統計情報（カテゴリ数、食材数）
 */
export const fetchStats = async (): Promise<StatsResponse> => {
    const response = await apiClient.get<StatsResponse>('/admin/stats');
    return response.data;
};

