import apiClient from '@/utils/axiosConfig';

export interface TransactionCategory {
    id: number;
    user_id: number | null;
    name: string;
    description: string | null;
    color: string;
    created_at: string;
    updated_at: string;
}

export interface Transaction {
    id: number;
    user_id: number;
    category_id: number | null;
    type: 'income' | 'expense';
    amount: string;
    description: string | null;
    transaction_date: string;
    created_at: string;
    updated_at: string;
    category?: TransactionCategory | null;
}

export interface TransactionStats {
    totalIncome: number;
    totalExpense: number;
    balance: number;
}

export interface TransactionFilters {
    type?: 'income' | 'expense' | 'all';
    category_id?: number;
    start_date?: string;
    end_date?: string;
}

/**
 * カテゴリ一覧を取得する
 * @returns カテゴリ一覧
 */
export const fetchTransactionCategories = async (): Promise<TransactionCategory[]> => {
    const response = await apiClient.get<TransactionCategory[]>('/transaction-categories');
    return response.data;
};

/**
 * カテゴリを取得する（ID指定）
 * @param id カテゴリID
 * @returns カテゴリ情報
 */
export const fetchTransactionCategoryById = async (id: number): Promise<TransactionCategory> => {
    const response = await apiClient.get<TransactionCategory>(`/transaction-categories/${id}`);
    return response.data;
};

/**
 * カテゴリを作成する
 * @param data カテゴリ作成データ
 * @returns 作成されたカテゴリ
 */
export const createTransactionCategory = async (data: {
    name: string;
    description?: string | null;
    color?: string;
}): Promise<TransactionCategory> => {
    const response = await apiClient.post<TransactionCategory>('/transaction-categories', data);
    return response.data;
};

/**
 * カテゴリを更新する
 * @param id カテゴリID
 * @param data 更新データ
 * @returns 更新されたカテゴリ
 */
export const updateTransactionCategory = async (
    id: number,
    data: {
        name?: string;
        description?: string | null;
        color?: string;
    }
): Promise<TransactionCategory> => {
    const response = await apiClient.put<TransactionCategory>(`/transaction-categories/${id}`, data);
    return response.data;
};

/**
 * カテゴリを削除する
 * @param id カテゴリID
 */
export const deleteTransactionCategory = async (id: number): Promise<void> => {
    await apiClient.delete(`/transaction-categories/${id}`);
};

/**
 * 記録一覧を取得する
 * @param filters フィルター条件
 * @returns 記録一覧
 */
export const fetchTransactions = async (filters?: TransactionFilters): Promise<Transaction[]> => {
    const params: any = {};
    if (filters?.type) params.type = filters.type;
    if (filters?.category_id) params.category_id = filters.category_id;
    if (filters?.start_date) params.start_date = filters.start_date;
    if (filters?.end_date) params.end_date = filters.end_date;

    const response = await apiClient.get<Transaction[]>('/transactions', { params });
    return response.data;
};

/**
 * 記録を取得する（ID指定）
 * @param id 記録ID
 * @returns 記録情報
 */
export const fetchTransactionById = async (id: number): Promise<Transaction> => {
    const response = await apiClient.get<Transaction>(`/transactions/${id}`);
    return response.data;
};

/**
 * 記録を作成する
 * @param data 記録作成データ
 * @returns 作成された記録
 */
export const createTransaction = async (data: {
    category_id?: number | null;
    type: 'income' | 'expense';
    amount: number;
    description?: string | null;
    transaction_date: string;
}): Promise<Transaction> => {
    const response = await apiClient.post<Transaction>('/transactions', data);
    return response.data;
};

/**
 * 記録を更新する
 * @param id 記録ID
 * @param data 更新データ
 * @returns 更新された記録
 */
export const updateTransaction = async (
    id: number,
    data: {
        category_id?: number | null;
        type?: 'income' | 'expense';
        amount?: number;
        description?: string | null;
        transaction_date?: string;
    }
): Promise<Transaction> => {
    const response = await apiClient.put<Transaction>(`/transactions/${id}`, data);
    return response.data;
};

/**
 * 記録を削除する
 * @param id 記録ID
 */
export const deleteTransaction = async (id: number): Promise<void> => {
    await apiClient.delete(`/transactions/${id}`);
};

/**
 * 記録の統計情報を取得する
 * @param startDate 開始日（オプション）
 * @param endDate 終了日（オプション）
 * @returns 統計情報
 */
export const fetchTransactionStats = async (
    startDate?: string,
    endDate?: string
): Promise<TransactionStats> => {
    const params: any = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const response = await apiClient.get<TransactionStats>('/transactions/stats', { params });
    return response.data;
};

