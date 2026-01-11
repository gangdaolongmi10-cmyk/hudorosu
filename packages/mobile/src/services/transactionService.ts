import apiClient from '../config/api';

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

export interface CreateTransactionData {
    category_id?: number | null;
    type: 'income' | 'expense';
    amount: number;
    description?: string | null;
    transaction_date: string;
}

export interface UpdateTransactionData {
    category_id?: number | null;
    type?: 'income' | 'expense';
    amount?: number;
    description?: string | null;
    transaction_date?: string;
}

export interface TransactionFilters {
    type?: 'income' | 'expense' | 'all';
    category_id?: number;
    start_date?: string;
    end_date?: string;
}

/**
 * カテゴリ一覧を取得する
 */
export const fetchTransactionCategories = async (): Promise<TransactionCategory[]> => {
    try {
        const response = await apiClient.get<TransactionCategory[]>('/transaction-categories');
        return response.data;
    } catch (error: any) {
        console.error('Transaction categories fetch API error:', error);
        console.error('Error response:', error.response?.data);
        throw error;
    }
};

/**
 * 記録一覧を取得する
 */
export const fetchTransactions = async (filters?: TransactionFilters): Promise<Transaction[]> => {
    try {
        const params: any = {};
        if (filters?.type && filters.type !== 'all') params.type = filters.type;
        if (filters?.category_id) params.category_id = filters.category_id;
        if (filters?.start_date) params.start_date = filters.start_date;
        if (filters?.end_date) params.end_date = filters.end_date;

        const response = await apiClient.get<Transaction[]>('/transactions', { params });
        return response.data;
    } catch (error: any) {
        console.error('Transactions fetch API error:', error);
        console.error('Error response:', error.response?.data);
        throw error;
    }
};

/**
 * 記録を取得する（ID指定）
 */
export const fetchTransactionById = async (id: number): Promise<Transaction> => {
    try {
        const response = await apiClient.get<Transaction>(`/transactions/${id}`);
        return response.data;
    } catch (error: any) {
        console.error('Transaction fetch API error:', error);
        console.error('Error response:', error.response?.data);
        throw error;
    }
};

/**
 * 記録を作成する
 */
export const createTransaction = async (data: CreateTransactionData): Promise<Transaction> => {
    try {
        const response = await apiClient.post<Transaction>('/transactions', data);
        return response.data;
    } catch (error: any) {
        console.error('Transaction creation API error:', error);
        console.error('Error response:', error.response?.data);
        throw error;
    }
};

/**
 * 記録を更新する
 */
export const updateTransaction = async (id: number, data: UpdateTransactionData): Promise<Transaction> => {
    try {
        const response = await apiClient.put<Transaction>(`/transactions/${id}`, data);
        return response.data;
    } catch (error: any) {
        console.error('Transaction update API error:', error);
        console.error('Error response:', error.response?.data);
        throw error;
    }
};

/**
 * 記録を削除する
 */
export const deleteTransaction = async (id: number): Promise<void> => {
    try {
        await apiClient.delete(`/transactions/${id}`);
    } catch (error: any) {
        console.error('Transaction delete API error:', error);
        console.error('Error response:', error.response?.data);
        throw error;
    }
};

/**
 * 記録の統計情報を取得する
 */
export const fetchTransactionStats = async (
    startDate?: string,
    endDate?: string
): Promise<TransactionStats> => {
    try {
        const params: any = {};
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;

        const response = await apiClient.get<TransactionStats>('/transactions/stats', { params });
        return response.data;
    } catch (error: any) {
        console.error('Transaction stats API error:', error);
        console.error('Error response:', error.response?.data);
        throw error;
    }
};

/**
 * 目標食費関連のインターフェース
 */
export interface DailyFoodBudget {
    daily_food_budget: number | null;
}

export interface TodayFoodExpense {
    daily_food_budget: number | null;
    today_expense: number;
    remaining: number | null;
    over_budget: number;
}

/**
 * 目標食費を取得する
 */
export const getDailyFoodBudget = async (): Promise<DailyFoodBudget> => {
    try {
        const response = await apiClient.get<DailyFoodBudget>('/food-budget');
        return response.data;
    } catch (error: any) {
        console.error('Get daily food budget API error:', error);
        console.error('Error response:', error.response?.data);
        throw error;
    }
};

/**
 * 目標食費を設定する
 */
export const setDailyFoodBudget = async (dailyFoodBudget: number | null): Promise<DailyFoodBudget> => {
    try {
        const response = await apiClient.put<DailyFoodBudget>('/food-budget', {
            daily_food_budget: dailyFoodBudget
        });
        return response.data;
    } catch (error: any) {
        console.error('Set daily food budget API error:', error);
        console.error('Error response:', error.response?.data);
        throw error;
    }
};

/**
 * 今日の食費情報を取得する
 */
export const getTodayFoodExpense = async (): Promise<TodayFoodExpense> => {
    try {
        const response = await apiClient.get<TodayFoodExpense>('/food-budget/today');
        return response.data;
    } catch (error: any) {
        console.error('Get today food expense API error:', error);
        console.error('Error response:', error.response?.data);
        throw error;
    }
};

