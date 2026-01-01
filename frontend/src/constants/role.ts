// ロール定数
export const ROLE = {
    ADMIN: 'admin',
    USER: 'user',
} as const;

export type Role = typeof ROLE[keyof typeof ROLE];

// ロールの表示名
export const ROLE_LABELS: Record<Role, string> = {
    [ROLE.ADMIN]: '管理者',
    [ROLE.USER]: '一般ユーザー',
};

// ロールのバッジカラー
export const ROLE_BADGE_COLORS: Record<Role, string> = {
    [ROLE.ADMIN]: 'bg-red-100 text-red-800 border-red-200',
    [ROLE.USER]: 'bg-blue-100 text-blue-800 border-blue-200',
};

// 権限一覧
export interface Permission {
    id: string;
    name: string;
    description: string;
}

export interface RolePermissions {
    role: Role;
    label: string;
    permissions: Permission[];
}

export const ROLE_PERMISSIONS: RolePermissions[] = [
    {
        role: ROLE.ADMIN,
        label: ROLE_LABELS[ROLE.ADMIN],
        permissions: [
            { id: 'user_manage', name: 'ユーザー管理', description: 'ユーザーの一覧表示、作成、編集、削除が可能' },
            { id: 'food_manage', name: '食材マスタ管理', description: '食材の一覧表示、作成、編集、削除が可能' },
            { id: 'category_manage', name: 'カテゴリ管理', description: 'カテゴリの一覧表示、作成、編集、削除が可能' },
            { id: 'stats_view', name: '統計情報閲覧', description: 'ダッシュボードの統計情報を閲覧可能' },
            { id: 'admin_access', name: '管理画面アクセス', description: '管理画面へのアクセスが可能' },
        ],
    },
    {
        role: ROLE.USER,
        label: ROLE_LABELS[ROLE.USER],
        permissions: [
            { id: 'basic_access', name: '基本アクセス', description: '基本的な機能へのアクセスが可能' },
        ],
    },
];

