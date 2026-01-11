import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminAside } from '@/components/admin/layout/AdminAside';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';
import { BREADCRUMB_ITEMS } from '@/constants/breadcrumb';
import { FlashMessage } from '@/components/common/FlashMessage';
import { fetchAllergens, updateAllergen } from '@/services/allergenService';
import { Allergen } from '@/services/allergenService';

export const AllergenEditPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [, setAllergen] = useState<Allergen | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
    });

    useEffect(() => {
        const loadAllergen = async () => {
            if (!id) {
                setError('アレルゲンIDが指定されていません');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);
                const allergens = await fetchAllergens();
                const foundAllergen = allergens.find(a => a.id === parseInt(id, 10));
                
                if (!foundAllergen) {
                    setError('アレルゲンが見つかりません');
                    setIsLoading(false);
                    return;
                }

                setAllergen(foundAllergen);
                setFormData({
                    name: foundAllergen.name || '',
                });
            } catch (err: any) {
                console.error('アレルゲン取得エラー:', err);
                setError(err.response?.data?.error || 'アレルゲン情報の取得に失敗しました');
            } finally {
                setIsLoading(false);
            }
        };

        loadAllergen();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        if (!id) {
            setError('アレルゲンIDが指定されていません');
            setIsSubmitting(false);
            return;
        }

        // バリデーション
        if (!formData.name || formData.name.trim() === '') {
            setError('アレルゲン名を入力してください');
            setIsSubmitting(false);
            return;
        }

        try {
            await updateAllergen(parseInt(id, 10), {
                name: formData.name.trim(),
            });
            
            // 成功したらアレルゲン一覧に戻る
            navigate('/admin/allergen');
        } catch (err: any) {
            console.error('アレルゲン更新エラー:', err);
            setError(err.response?.data?.error || 'アレルゲンの更新に失敗しました');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/allergen');
    };

    if (isLoading) {
        return (
            <div className="flex h-screen bg-slate-50">
                <AdminAside />
                <main className="flex-1 flex flex-col overflow-hidden">
                    <AdminHeader />
                    <div className="p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                        <div className="flex items-center justify-center py-12">
                            <div className="flex items-center gap-3 text-slate-500">
                                <i className="fas fa-spinner fa-spin text-2xl"></i>
                                <span className="text-lg font-medium">読み込み中...</span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-50">
            <AdminAside />
            <main className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader />
                <div className="p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                    {/* ヘッダーセクション */}
                    <div className="flex items-center justify-between">
                        <div>
                            <AdminBreadcrumb items={BREADCRUMB_ITEMS['/admin/allergen/:id/edit']} />
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">アレルゲン編集</h2>
                        </div>
                    </div>

                    {/* フラッシュメッセージ */}
                    <FlashMessage
                        message={error}
                        type="error"
                        onClose={() => setError(null)}
                    />

                    {/* フォーム */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                            <h3 className="text-lg font-bold text-slate-900">アレルゲン情報</h3>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        アレルゲン名 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                        placeholder="アレルゲン名を入力"
                                        required
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-bold"
                                    >
                                        キャンセル
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-6 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2">
                                                <i className="fas fa-spinner fa-spin"></i>
                                                更新中...
                                            </span>
                                        ) : (
                                            '更新する'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

