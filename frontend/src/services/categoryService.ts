import apiClient from '@/utils/axiosConfig';
import { Category, CategoryResponse } from '@/types/category';

// カテゴリー名に基づいて色を割り当てる関数
const getCategoryColor = (name: string): string => {
    const colorMap: Record<string, string> = {
        '野菜': 'bg-green-500',
        '果物': 'bg-red-500',
        '肉': 'bg-blue-500',
        '魚': 'bg-yellow-500',
        '乳製品': 'bg-purple-500',
        '穀物': 'bg-orange-500',
        '豆': 'bg-pink-500',
        '調味料': 'bg-gray-500',
        'その他': 'bg-indigo-500',
    };
    
    return colorMap[name] || 'bg-slate-500';
};

/**
 * カテゴリー一覧を取得する
 * @returns カテゴリーの配列（色情報を含む）
 */
export const fetchCategories = async (): Promise<Category[]> => {
    const response = await apiClient.get<CategoryResponse[]>('/admin/categories/list');
    
    // レスポンスデータに色情報を追加
    return response.data.map((category) => ({
        ...category,
        color: getCategoryColor(category.name),
    }));
};

