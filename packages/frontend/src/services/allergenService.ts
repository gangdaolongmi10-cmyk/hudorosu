import apiClient from '@/utils/axiosConfig';

export interface Allergen {
    id: number;
    name: string;
}

/**
 * アレルゲン一覧を取得する
 * @returns アレルゲンの配列
 */
export const fetchAllergens = async (): Promise<Allergen[]> => {
    const response = await apiClient.get<Allergen[]>('/admin/allergens/list');
    return response.data;
};

/**
 * 新規アレルゲンを作成する
 * @param data アレルゲン作成データ
 * @returns 作成されたアレルゲン情報
 */
export const createAllergen = async (data: {
    name: string;
}): Promise<Allergen> => {
    const response = await apiClient.post<Allergen>('/admin/allergens/create', data);
    return response.data;
};

/**
 * アレルゲン情報を更新する
 * @param id アレルゲンID
 * @param data 更新するアレルゲン情報
 * @returns 更新されたアレルゲン情報
 */
export const updateAllergen = async (id: number, data: {
    name: string;
}): Promise<Allergen> => {
    const response = await apiClient.put<Allergen>(`/admin/allergens/${id}`, data);
    return response.data;
};

/**
 * アレルゲンを削除する
 * @param id アレルゲンID
 */
export const deleteAllergen = async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/allergens/${id}`);
};
