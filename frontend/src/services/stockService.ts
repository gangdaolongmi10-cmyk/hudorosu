import apiClient from '@/utils/axiosConfig';

export interface Stock {
    id: number;
    user_id: number;
    food_id: number;
    expiry_date: string;
    storage_type: 'refrigerator' | 'freezer' | 'pantry';
    quantity: string | null;
    memo: string | null;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        email: string;
        name: string | null;
        role: string | null;
    };
    food?: {
        id: number;
        name: string;
        category_id: number;
        category?: {
            id: number;
            name: string;
            description: string | null;
        };
    };
}

export interface StocksResponse {
    stocks: Stock[];
    totalCount: number;
}

export interface StocksStatsResponse {
    totalStocks: number;
    userStockCounts: Record<number, number>;
    storageTypeCounts: {
        refrigerator: number;
        freezer: number;
        pantry: number;
    };
    expiredCount: number;
    expiringSoonCount: number;
}

/**
 * 在庫一覧を取得する（管理者用）
 * @param userId ユーザーID（オプション）
 * @param storageType 保存タイプ（オプション）
 * @returns 在庫一覧と総数
 */
export const fetchStocks = async (
    userId?: number,
    storageType?: 'refrigerator' | 'freezer' | 'pantry'
): Promise<StocksResponse> => {
    const params: any = {};
    if (userId) params.user_id = userId;
    if (storageType) params.storage_type = storageType;

    const response = await apiClient.get<StocksResponse>('/admin/stocks/list', { params });
    return response.data;
};

/**
 * 在庫統計情報を取得する（管理者用）
 * @returns 在庫統計情報
 */
export const fetchStocksStats = async (): Promise<StocksStatsResponse> => {
    const response = await apiClient.get<StocksStatsResponse>('/admin/stocks/stats');
    return response.data;
};

/**
 * 一般ユーザーの在庫一覧を取得する（自分の在庫のみ）
 * @param storageType 保存タイプ（オプション）
 * @returns 在庫一覧と総数
 */
export const fetchUserStocks = async (
    storageType?: 'refrigerator' | 'freezer' | 'pantry'
): Promise<StocksResponse> => {
    const params: any = {};
    if (storageType) params.storage_type = storageType;

    const response = await apiClient.get<StocksResponse>('/stocks/management', { params });
    return response.data;
};

