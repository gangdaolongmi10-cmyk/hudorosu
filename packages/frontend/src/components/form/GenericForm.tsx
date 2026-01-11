import React, { useState } from 'react';
import axios from 'axios';

interface GenericFormProps<T> {
    endpoint: string;
    initialValues: T;
    onSuccess?: (data: any) => void;
    renderForm: (props: {
        values: T;
        handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        isLoading: boolean;
    }) => React.ReactNode;
    submitLabel?: string;
}

export function GenericForm<T>({ endpoint, initialValues, onSuccess, renderForm, submitLabel = '確定' }: GenericFormProps<T>) {
    const [values, setValues] = useState<T>(initialValues);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * フォームの値を更新する
     * 
     * @param e フォーム送信イベント
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    /**
     * フォーム送信処理
     * 
     * @param e 
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };
            
            // ログインエンドポイント以外ではトークンを追加
            if (token && !endpoint.includes('/login')) {
                headers.Authorization = `Bearer ${token}`;
            }
            
            const response = await axios.post(endpoint, values, { headers });
            if (onSuccess) onSuccess(response.data);
        } catch (error: any) {
            console.error("送信エラー:", error);
            if (error.response?.data?.error) {
                alert(error.response.data.error);
            } else {
                alert("送信に失敗しました");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {renderForm({ values, handleChange, isLoading })}
            <button
                type="submit"
                disabled={isLoading}
                className="mt-6 w-full py-4 bg-sky-500 text-white rounded-2xl font-bold hover:bg-sky-600 active:scale-[0.98] transition-all shadow-lg shadow-sky-100 flex items-center justify-center gap-2 text-lg disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <i className="fas fa-circle-notch animate-spin"></i>
                        <span>送信中...</span>
                    </>
                ) : (
                    submitLabel
                )}
            </button>
        </form>
    );
}