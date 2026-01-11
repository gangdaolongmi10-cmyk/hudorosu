// 共通のロール定数をインポート
import { ROLE, type Role, DEFAULT_ROLE } from '@shared/constants/role';

// 共通のロール定数を再エクスポート
export { ROLE, type Role, DEFAULT_ROLE };

// ロールの表示名（フロントエンド専用）
export const ROLE_LABELS: Record<Role, string> = {
    [ROLE.ADMIN]: '管理者',
    [ROLE.USER]: '一般ユーザー',
};

// ロールのバッジカラー（フロントエンド専用）
export const ROLE_BADGE_COLORS: Record<Role, string> = {
    [ROLE.ADMIN]: 'bg-red-100 text-red-800 border-red-200',
    [ROLE.USER]: 'bg-blue-100 text-blue-800 border-blue-200',
};

// 権限一覧（フロントエンド専用）
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
            { id: 'admin_access', name: '管理画面アクセス', description: '管理画面へのアクセスが可能' },
        ],
    },
    {
        role: ROLE.USER,
        label: ROLE_LABELS[ROLE.USER],
        permissions: [
            { id: 'basic_access', name: '基本アクセス', description: 'モバイルのへのアクセスが可能' },
        ],
    },
];
