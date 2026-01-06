import { NavItems } from '@/types/nav';

export const ADMIN_NAV_ITEMS: NavItems = [
    { label: 'ユーザー管理', icon: 'fas fa-users', path: '/admin/user' },
    { label: '権限管理', icon: 'fas fa-shield-alt', path: '/admin/role' },
    { label: '食材マスタ', icon: 'fas fa-database', path: '/admin/food' },
    { label: '料理管理', icon: 'fas fa-utensils', path: '/admin/recipe' },
    { label: 'カテゴリ管理', icon: 'fas fa-tags', path: '/admin/category' },
    { label: 'アレルゲン管理', icon: 'fas fa-exclamation-triangle', path: '/admin/allergen' },
    { label: '在庫管理', icon: 'fas fa-box', path: '/admin/stock' },
    { label: 'FAQ管理', icon: 'fas fa-question-circle', path: '/admin/faq' },
    { label: 'ログインログ', icon: 'fas fa-history', path: '/admin/login-logs' },
    { label: '帳票', icon: 'fas fa-file-alt', path: '/admin/report' },
];

// 一般ユーザー用のナビゲーション
export const USER_NAV_ITEMS: NavItems = [
    { label: '在庫管理', icon: 'fas fa-box', path: '/admin/stock' },
];
