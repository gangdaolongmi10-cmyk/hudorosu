import apiClient from '../config/api';

export interface MasterFood {
    id: number;
    name: string;
    category_id: number;
    user_id: number | null;
    best_before_date: string | null;
    expiry_date: string | null;
    memo: string | null;
    calories: number | null;
    protein: number | null;
    fat: number | null;
    carbohydrate: number | null;
    fiber: number | null;
    sodium: number | null;
    serving_size: number | null;
    created_at: string;
    updated_at: string;
    category?: {
        id: number;
        name: string;
        description: string | null;
    };
    allergen_id_allergens?: Array<{
        id: number;
        name: string;
    }>;
}

export interface Category {
    id: number;
    name: string;
    description: string | null;
    foodCount: number;
}

export interface CreateFoodData {
    name: string;
    category_id: number;
    best_before_date?: string | null;
    expiry_date?: string | null;
    memo?: string | null;
    allergen_ids?: number[];
}

/**
 * マスタ食材一覧を取得する
 */
export const fetchMasterFoods = async (): Promise<MasterFood[]> => {
    const response = await apiClient.get<MasterFood[]>('/foods/master');
    return response.data;
};

/**
 * カテゴリー別マスタ食材を取得する
 */
export const fetchMasterFoodsByCategory = async (
    categoryId: number,
    limit: number = 20,
    offset: number = 0
): Promise<{
    foods: MasterFood[];
    total: number;
    limit: number;
    offset: number;
}> => {
    const response = await apiClient.get<{
        foods: MasterFood[];
        total: number;
        limit: number;
        offset: number;
    }>(`/foods/master/category/${categoryId}`, {
        params: { limit, offset }
    });
    return response.data;
};

/**
 * カテゴリー一覧を取得する
 */
export const fetchCategories = async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/categories/list');
    return response.data;
};

/**
 * ユーザー固有の食材を作成する
 */
export const createUserFood = async (data: CreateFoodData): Promise<MasterFood> => {
    try {
        console.log('Sending food creation request:', data);
        const response = await apiClient.post<MasterFood>('/foods/create', data);
        console.log('Food creation response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Food creation API error:', error);
        console.error('Error response:', error.response?.data);
        throw error;
    }
};
