export interface CategoryResponse {
    id: number;
    name: string;
    description: string | null;
    foodCount?: number;
}

export interface Category {
    id: number;
    name: string;
    description: string | null;
    color: string;
    foodCount?: number;
}

export type Categories = Category[];