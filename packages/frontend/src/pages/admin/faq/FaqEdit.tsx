import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminAside } from '@/components/admin/layout/AdminAside';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';
import { BREADCRUMB_ITEMS } from '@/constants/breadcrumb';
import { FlashMessage } from '@/components/common/FlashMessage';
import { fetchFaqs, updateFaq } from '@/services/faqService';
import { Faq } from '@/services/faqService';

export const FaqEditPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [, setFaq] = useState<Faq | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        order: 0,
    });

    useEffect(() => {
        const loadFaq = async () => {
            if (!id) {
                setError('FAQ IDが指定されていません');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);
                const faqs = await fetchFaqs();
                const foundFaq = faqs.find(f => f.id === parseInt(id, 10));
                
                if (!foundFaq) {
                    setError('FAQが見つかりません');
                    setIsLoading(false);
                    return;
                }

                setFaq(foundFaq);
                setFormData({
                    question: foundFaq.question || '',
                    answer: foundFaq.answer || '',
                    order: foundFaq.order || 0,
                });
            } catch (err: any) {
                console.error('FAQ取得エラー:', err);
                setError(err.response?.data?.error || 'FAQ情報の取得に失敗しました');
            } finally {
                setIsLoading(false);
            }
        };

        loadFaq();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        if (!id) {
            setError('FAQ IDが指定されていません');
            setIsSubmitting(false);
            return;
        }

        // バリデーション
        if (!formData.question || formData.question.trim() === '') {
            setError('質問を入力してください');
            setIsSubmitting(false);
            return;
        }

        if (!formData.answer || formData.answer.trim() === '') {
            setError('回答を入力してください');
            setIsSubmitting(false);
            return;
        }

        try {
            await updateFaq(parseInt(id, 10), {
                question: formData.question.trim(),
                answer: formData.answer.trim(),
                order: parseInt(String(formData.order), 10) || 0,
            });
            
            // 成功したらFAQ一覧に戻る
            navigate('/admin/faq');
        } catch (err: any) {
            console.error('FAQ更新エラー:', err);
            setError(err.response?.data?.error || 'FAQの更新に失敗しました');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/faq');
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
                            <AdminBreadcrumb items={BREADCRUMB_ITEMS['/admin/faq/:id/edit']} />
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">FAQ編集</h2>
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
                            <h3 className="text-lg font-bold text-slate-900">FAQ情報</h3>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        表示順 <span className="text-slate-400 text-xs">(数値が小さいほど上に表示)</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                        placeholder="0"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        質問 <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={formData.question}
                                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                        placeholder="質問を入力してください"
                                        rows={3}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        回答 <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={formData.answer}
                                        onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                        placeholder="回答を入力してください"
                                        rows={6}
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

