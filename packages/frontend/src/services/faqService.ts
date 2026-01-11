import apiClient from '@/utils/axiosConfig';

export interface Faq {
    id: number;
    question: string;
    answer: string;
    order: number;
}

/**
 * FAQ一覧を取得する
 * @returns FAQの配列
 */
export const fetchFaqs = async (): Promise<Faq[]> => {
    const response = await apiClient.get<Faq[]>('/admin/faqs/list');
    return response.data;
};

/**
 * 新規FAQを作成する
 * @param data FAQ作成データ
 * @returns 作成されたFAQ情報
 */
export const createFaq = async (data: {
    question: string;
    answer: string;
    order?: number;
}): Promise<Faq> => {
    const response = await apiClient.post<Faq>('/admin/faqs/create', data);
    return response.data;
};

/**
 * FAQ情報を更新する
 * @param id FAQ ID
 * @param data 更新するFAQ情報
 * @returns 更新されたFAQ情報
 */
export const updateFaq = async (id: number, data: {
    question?: string;
    answer?: string;
    order?: number;
}): Promise<Faq> => {
    const response = await apiClient.put<Faq>(`/admin/faqs/${id}`, data);
    return response.data;
};

/**
 * FAQを削除する
 * @param id FAQ ID
 */
export const deleteFaq = async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/faqs/${id}`);
};

