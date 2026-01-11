// バックエンドAPIのレスポンス型
export interface AllergenResponse {
    id: number;
    name: string;
}

export interface CategoryResponse {
    id: number;
    name: string;
    description: string | null;
}

export interface FoodResponse {
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
    category: CategoryResponse;
    allergen_id_allergens: AllergenResponse[];
}

// フロントエンドで使用する型
export interface Food {
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
    category: CategoryResponse;
    allergens: AllergenResponse[];
}

export type Foods = Food[];
