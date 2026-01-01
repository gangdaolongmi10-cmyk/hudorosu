// ロール定数
export const ROLE = {
    ADMIN: 'admin',
    USER: 'user',
} as const;

export type Role = typeof ROLE[keyof typeof ROLE];

// デフォルトロール
export const DEFAULT_ROLE = ROLE.USER;

