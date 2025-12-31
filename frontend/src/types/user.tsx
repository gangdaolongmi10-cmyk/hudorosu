// バックエンドAPIのレスポンス型
export interface UserResponse {
    id: number;
    email: string;
    name: string | null;
    role: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}

// フロントエンドで使用する型
export interface User {
    id: number;
    email: string;
    name: string | null;
    role: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}

export type Users = User[];

