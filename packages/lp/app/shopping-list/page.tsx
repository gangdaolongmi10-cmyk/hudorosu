import { Metadata } from 'next';
import ShoppingListClient from './ShoppingListClient';

export const metadata: Metadata = {
    title: 'お買い物リスト | ふどろす',
    description: 'ログイン不要ですぐに使える、シンプルで使いやすいお買い物リスト。お店ごとに自動でグループ化され、スムーズなお買い物をサポートします。',
};

export default function ShoppingListPage() {
    return <ShoppingListClient />;
}
