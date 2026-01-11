import apiClient from '../config/api';

export interface Faq {
    id: number;
    question: string;
    answer: string;
    order: number;
}

/**
 * FAQ一覧を取得する
 */
export const fetchFaqs = async (): Promise<Faq[]> => {
    const response = await apiClient.get<Faq[]>('/faqs');
    return response.data;
};

