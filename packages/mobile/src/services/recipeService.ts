import apiClient from '../config/api';

export interface RecipeFood {
    food_id: number;
    quantity: string | null;
    food?: {
        id: number;
        name: string;
        category_id: number;
        category?: {
            id: number;
            name: string;
        };
        allergen_id_allergens?: Array<{
            id: number;
            name: string;
        }>;
    };
}

export interface Recipe {
    id: number;
    name: string;
    description: string | null;
    image_url: string | null;
    cooking_time: number | null;
    servings: number | null;
    instructions: string | null;
    created_at: string;
    updated_at: string;
    food_id_foods?: RecipeFood[];
    matchRatio?: number;
    availableFoods?: number;
    totalFoods?: number;
    total_price?: number | null;
    is_favorite?: boolean;
}

/**
 * 在庫にある食材でおすすめレシピを取得する
 */
export const fetchRecommendedRecipes = async (): Promise<Recipe[]> => {
    const response = await apiClient.get<Recipe[]>('/recipes/recommended');
    return response.data;
};

/**
 * 1日の食費予算に基づいておすすめレシピを取得する
 */
export interface RecommendedRecipesByBudgetResponse {
    recipes: Recipe[];
    daily_food_budget: number | null;
    message: string;
}

export const fetchRecommendedRecipesByBudget = async (): Promise<RecommendedRecipesByBudgetResponse> => {
    const response = await apiClient.get<RecommendedRecipesByBudgetResponse>('/recipes/recommended-by-budget');
    return response.data;
};

/**
 * レシピ一覧を取得する
 */
export const fetchRecipes = async (): Promise<Recipe[]> => {
    const response = await apiClient.get<Recipe[]>('/recipes');
    return response.data;
};

/**
 * IDでレシピを取得する
 */
export const fetchRecipeById = async (id: number): Promise<Recipe> => {
    const response = await apiClient.get<Recipe>(`/recipes/${id}`);
    return response.data;
};

/**
 * レシピを削除する
 */
export const deleteRecipe = async (id: number): Promise<void> => {
    await apiClient.delete(`/recipes/${id}`);
};

