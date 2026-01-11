import React, { useEffect, useState } from 'react';
import { AdminAside } from '@/components/admin/layout/AdminAside';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminBreadcrumb } from '@/components/admin/layout/AdminBreadcrumb';
import { BREADCRUMB_ITEMS } from '@/constants/breadcrumb';
import { FlashMessage } from '@/components/common/FlashMessage';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { Faq, fetchFaqs, deleteFaq } from '@/services/faqService';
import { useNavigate } from 'react-router-dom';

export const FaqIndexPage: React.FC = () => {
    const navigate = useNavigate();
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [faqToDelete, setFaqToDelete] = useState<Faq | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const loadFaqs = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await fetchFaqs();
                setFaqs(data);
            } catch (err: any) {
                console.error('FAQ取得エラー:', err);
                setError(err.response?.data?.error || 'FAQの取得に失敗しました');
            } finally {
                setIsLoading(false);
            }
        };

        loadFaqs();
    }, []);

    const handleEdit = (id: number) => {
        navigate(`/admin/faq/${id}/edit`);
    };

    const handleDeleteClick = (faq: Faq) => {
        setFaqToDelete(faq);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!faqToDelete) return;

        try {
            setIsDeleting(true);
            await deleteFaq(faqToDelete.id);
            // 一覧を再読み込み
            const data = await fetchFaqs();
            setFaqs(data);
            setDeleteModalOpen(false);
            setFaqToDelete(null);
        } catch (err: any) {
            console.error('FAQ削除エラー:', err);
            setError(err.response?.data?.error || 'FAQの削除に失敗しました');
            setDeleteModalOpen(false);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModalOpen(false);
        setFaqToDelete(null);
    };

    return (
        <div className="flex h-screen bg-slate-50">
            <AdminAside />
            <main className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader />
                <div className="p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                    {/* ヘッダーセクション */}
                    <div className="flex items-center justify-between">
                        <div>
                            <AdminBreadcrumb items={BREADCRUMB_ITEMS['/admin/faq']} />
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">FAQ一覧</h2>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => navigate('/admin/faq/create')}
                                className="flex items-center gap-2 px-6 py-2.5 text-sm bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-all shadow-lg shadow-sky-100 font-bold"
                            >
                                <i className="fas fa-plus text-xs"></i> 新規FAQを追加
                            </button>
                        </div>
                    </div>

                    {/* フラッシュメッセージ */}
                    <FlashMessage message={error} type="error" onClose={() => setError(null)}/>

                    {/* ローディング状態 */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex items-center gap-3 text-slate-500">
                                <i className="fas fa-spinner fa-spin text-2xl"></i>
                                <span className="text-lg font-medium">読み込み中...</span>
                            </div>
                        </div>
                    ) : faqs.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <i className="fas fa-exclamation-triangle text-6xl text-slate-300 mb-4"></i>
                                <p className="text-slate-500 text-lg font-medium">FAQが登録されていません</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white/50">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    {faqs.length} 件
                                </span>
                            </div>
                            <table className="w-full text-left border-collapse text-sm">
                                <thead className="bg-slate-50/50 text-slate-500 font-bold uppercase tracking-widest text-[11px]">
                                    <tr>
                                        <th className="px-6 py-4 border-b border-slate-100">表示順</th>
                                        <th className="px-6 py-4 border-b border-slate-100">質問</th>
                                        <th className="px-6 py-4 border-b border-slate-100">回答</th>
                                        <th className="px-6 py-4 border-b border-slate-100 text-center">操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {faqs.map((faq) => (
                                        <tr key={faq.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 border-b border-slate-100">
                                                <span className="font-bold text-slate-900">{faq.order}</span>
                                            </td>
                                            <td className="px-6 py-4 border-b border-slate-100">
                                                <span className="font-bold text-slate-900">{faq.question}</span>
                                            </td>
                                            <td className="px-6 py-4 border-b border-slate-100">
                                                <span className="text-slate-700 line-clamp-2">{faq.answer}</span>
                                            </td>
                                            <td className="px-6 py-4 border-b border-slate-100 text-center">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button
                                                        onClick={() => handleEdit(faq.id)}
                                                        className="text-sky-600 hover:text-sky-700 transition-colors"
                                                        title="編集"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(faq)}
                                                        className="text-red-600 hover:text-red-700 transition-colors"
                                                        title="削除"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* 削除確認モーダル */}
                    <ConfirmModal
                        isOpen={deleteModalOpen}
                        title="FAQの削除"
                        message={`「${faqToDelete?.question}」を削除してもよろしいですか？この操作は取り消せません。`}
                        confirmText={isDeleting ? "削除中..." : "削除"}
                        cancelText="キャンセル"
                        onConfirm={handleDeleteConfirm}
                        onCancel={handleDeleteCancel}
                        variant="danger"
                    />
                </div>
            </main>
        </div>
    );
};

