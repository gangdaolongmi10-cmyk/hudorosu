// バックエンドAPIのレスポンス型
export interface CategoryResponse {
    id: number;
    name: string;
    description: string | null;
}

// フロントエンドで使用する型（色情報を含む）
export interface Category {
    id: number;
    name: string;
    description: string | null;
    color: string;
}

export type Categories = Category[];