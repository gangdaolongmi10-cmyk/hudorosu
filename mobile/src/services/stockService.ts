import apiClient from '../config/api';

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

export interface CreateStockData {
    food_id: number;
    expiry_date: string;
    storage_type: 'refrigerator' | 'freezer' | 'pantry';
    quantity?: string | null;
    memo?: string | null;
}

export interface UpdateStockData {
    food_id?: number;
    expiry_date?: string;
    storage_type?: 'refrigerator' | 'freezer' | 'pantry';
    quantity?: string | null;
    memo?: string | null;
}

/**
 * 在庫一覧を取得する
 */
export const fetchStocks = async (
    storageType?: 'refrigerator' | 'freezer' | 'pantry'
): Promise<Stock[]> => {
    const params = storageType ? { storage_type: storageType } : {};
    const response = await apiClient.get<Stock[]>('/stocks', { params });
    return response.data;
};

/**
 * 在庫を取得する（ID指定）
 */
export const fetchStockById = async (id: number): Promise<Stock> => {
    const response = await apiClient.get<Stock>(`/stocks/${id}`);
    return response.data;
};

/**
 * 在庫を作成する
 */
export const createStock = async (data: CreateStockData): Promise<Stock> => {
    try {
        const response = await apiClient.post<Stock>('/stocks', data);
        return response.data;
    } catch (error: any) {
        console.error('Stock creation API error:', error);
        console.error('Error response:', error.response?.data);
        throw error;
    }
};

/**
 * 在庫を更新する
 */
export const updateStock = async (id: number, data: UpdateStockData): Promise<Stock> => {
    try {
        console.log('Sending stock update request:', { id, data });
        const response = await apiClient.put<Stock>(`/stocks/${id}`, data);
        console.log('Stock update response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Stock update API error:', error);
        console.error('Error response:', error.response?.data);
        throw error;
    }
};

/**
 * 在庫を削除する
 */
export const deleteStock = async (id: number): Promise<void> => {
    try {
        console.log('Sending stock delete request:', id);
        await apiClient.delete(`/stocks/${id}`);
        console.log('Stock deleted successfully');
    } catch (error: any) {
        console.error('Stock delete API error:', error);
        console.error('Error response:', error.response?.data);
        throw error;
    }
};

