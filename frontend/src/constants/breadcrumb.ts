import { BreadcrumbItem } from '@/components/admin/layout/AdminBreadcrumb';

// パンくずリストの定数定義
// 各ページのパスに対応するパンくずリストを定義
// HOMEは自動的に追加されるため、ここでは定義しない

export const BREADCRUMB_ITEMS: Record<string, BreadcrumbItem[]> = {
    // 食材マスタ関連
    '/admin/food': [
        { label: '食材マスタ管理' }
    ],
    '/admin/food/create': [
        { label: '食材マスタ管理', path: '/admin/food' },
        { label: '新規食材作成' }
    ],
    '/admin/food/:id/edit': [
        { label: '食材マスタ管理', path: '/admin/food' },
        { label: '食材編集' }
    ],

    // カテゴリ関連
    '/admin/category': [
        { label: 'カテゴリ管理' }
    ],
    '/admin/category/create': [
        { label: 'カテゴリ管理', path: '/admin/category' },
        { label: '新規カテゴリ作成' }
    ],
    '/admin/category/:id/edit': [
        { label: 'カテゴリ管理', path: '/admin/category' },
        { label: 'カテゴリ編集' }
    ],

    // アレルゲン関連
    '/admin/allergen': [
        { label: 'アレルゲン管理' }
    ],
    '/admin/allergen/create': [
        { label: 'アレルゲン管理', path: '/admin/allergen' },
        { label: '新規アレルゲン作成' }
    ],
    '/admin/allergen/:id/edit': [
        { label: 'アレルゲン管理', path: '/admin/allergen' },
        { label: 'アレルゲン編集' }
    ],

    // ユーザー関連
    '/admin/user': [
        { label: 'ユーザー管理' }
    ],
    '/admin/user/create': [
        { label: 'ユーザー管理', path: '/admin/user' },
        { label: '新規ユーザー作成' }
    ],
    '/admin/user/:id/edit': [
        { label: 'ユーザー管理', path: '/admin/user' },
        { label: 'ユーザー編集' }
    ],

    // その他
    '/admin/login-logs': [
        { label: 'ログインログ' }
    ],
    '/admin/role': [
        { label: '権限管理' }
    ],
    '/admin/settings': [
        { label: '設定' }
    ],
};

// パスからパンくずリストを取得する関数
// 動的パス（:idなど）にも対応
export const getBreadcrumbItems = (pathname: string): BreadcrumbItem[] => {
    // 完全一致を確認
    if (BREADCRUMB_ITEMS[pathname]) {
        return BREADCRUMB_ITEMS[pathname];
    }

    // 動的パスに対応（例: /admin/food/123/edit → /admin/food/:id/edit）
    for (const [pattern, items] of Object.entries(BREADCRUMB_ITEMS)) {
        if (pattern.includes(':')) {
            // パターンを正規表現に変換
            const regexPattern = pattern.replace(/:[^/]+/g, '[^/]+');
            const regex = new RegExp(`^${regexPattern}$`);
            if (regex.test(pathname)) {
                return items;
            }
        }
    }

    // デフォルト（見つからない場合）
    return [];
};

