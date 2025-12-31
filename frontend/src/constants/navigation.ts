import { NavItems } from '@/types/nav';

export const ADMIN_NAV_ITEMS: NavItems = [
    { label: 'ユーザー管理', icon: 'fas fa-users', path: '/admin/user' },
    { label: '食材マスタ', icon: 'fas fa-database', path: '/admin/food' },
    { label: 'カテゴリ管理', icon: 'fas fa-tags', path: '/admin/category' },
];