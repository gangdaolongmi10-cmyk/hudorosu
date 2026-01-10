import apiClient from '../config/api';

export interface ShoppingListItem {
    id: number;
    user_id: number;
    food_id: number;
    quantity: string | null;
    is_purchased: boolean;
    memo: string | null;
    created_at: string;
    updated_at: string;
    food?: {
        id: number;
        name: string;
        category_id: number;
        price?: number | null;
        category?: {
            id: number;
            name: string;
        };
    };
}

export interface CreateShoppingListItemData {
    food_id: number;
    quantity?: string | null;
    memo?: string | null;
}

export interface UpdateShoppingListItemData {
    quantity?: string | null;
    is_purchased?: boolean;
    memo?: string | null;
}

/**
 * 買い物リストを取得する
 */
export const fetchShoppingList = async (includePurchased: boolean = true): Promise<ShoppingListItem[]> => {
    const response = await apiClient.get<ShoppingListItem[]>('/shopping-list', {
        params: { include_purchased: includePurchased }
    });
    return response.data;
};

/**
 * 買い物リストアイテムを作成する
 */
export const createShoppingListItem = async (data: CreateShoppingListItemData): Promise<ShoppingListItem> => {
    const response = await apiClient.post<ShoppingListItem>('/shopping-list', data);
    return response.data;
};

/**
 * 買い物リストアイテムを更新する
 */
export const updateShoppingListItem = async (id: number, data: UpdateShoppingListItemData): Promise<ShoppingListItem> => {
    const response = await apiClient.put<ShoppingListItem>(`/shopping-list/${id}`, data);
    return response.data;
};

/**
 * 買い物リストアイテムを削除する
 */
export const deleteShoppingListItem = async (id: number): Promise<void> => {
    await apiClient.delete(`/shopping-list/${id}`);
};

/**
 * 購入済みアイテムを一括削除する
 */
export const deletePurchasedItems = async (): Promise<void> => {
    await apiClient.delete('/shopping-list/purchased');
};

/**
 * レシピから買い物リストを作成する
 */
export const createShoppingListFromRecipe = async (recipeId: number): Promise<{ message: string; items: ShoppingListItem[] }> => {
    const response = await apiClient.post<{ message: string; items: ShoppingListItem[] }>('/shopping-list/from-recipe', {
        recipe_id: recipeId
    });
    return response.data;
};
