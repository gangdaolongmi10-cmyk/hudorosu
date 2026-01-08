const db = require('../../models');
const { Op } = require('sequelize');

export interface CreateTransactionData {
    user_id: number;
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

export const transactionRepository = {
    /**
     * ユーザーの記録一覧を取得する
     * 
     * @param userId ユーザーID
     * @param filters フィルター条件
     * @returns 記録の配列
     */
    async findByUserId(userId: number, filters?: TransactionFilters) {
        const where: any = {
            user_id: userId
        };

        if (filters) {
            if (filters.type && filters.type !== 'all') {
                where.type = filters.type;
            }
            if (filters.category_id) {
                where.category_id = filters.category_id;
            }
            if (filters.start_date || filters.end_date) {
                where.transaction_date = {};
                if (filters.start_date) {
                    where.transaction_date[Op.gte] = filters.start_date;
                }
                if (filters.end_date) {
                    where.transaction_date[Op.lte] = filters.end_date;
                }
            }
        }

        return await db.transactions.findAll({
            where,
            include: [
                {
                    model: db.transaction_categories,
                    as: 'category',
                    attributes: ['id', 'name', 'description', 'color']
                }
            ],
            attributes: ['id', 'user_id', 'category_id', 'type', 'amount', 'description', 'transaction_date', 'created_at', 'updated_at'],
            order: [['transaction_date', 'DESC'], ['created_at', 'DESC']]
        });
    },

    /**
     * IDで記録を取得する
     * 
     * @param id 記録ID
     * @param userId ユーザーID（オプション、セキュリティチェック用）
     * @returns 記録情報
     */
    async findById(id: number, userId?: number) {
        const where: any = { id };
        
        if (userId) {
            where.user_id = userId;
        }

        return await db.transactions.findOne({
            where,
            include: [
                {
                    model: db.transaction_categories,
                    as: 'category',
                    attributes: ['id', 'name', 'description', 'color']
                }
            ],
            attributes: ['id', 'user_id', 'category_id', 'type', 'amount', 'description', 'transaction_date', 'created_at', 'updated_at']
        });
    },

    /**
     * 記録を作成する
     * 
     * @param data 記録作成データ
     * @returns 作成された記録
     */
    async create(data: CreateTransactionData) {
        const transaction = await db.transactions.create({
            user_id: data.user_id,
            category_id: data.category_id || null,
            type: data.type,
            amount: data.amount,
            description: data.description || null,
            transaction_date: data.transaction_date,
        });

        // 作成された記録を再取得（関連情報を含む）
        return await this.findById(transaction.id);
    },

    /**
     * 記録を更新する
     * 
     * @param id 記録ID
     * @param userId ユーザーID
     * @param data 更新データ
     * @returns 更新された記録
     */
    async update(id: number, userId: number, data: UpdateTransactionData) {
        const transaction = await db.transactions.findOne({
            where: {
                id,
                user_id: userId
            }
        });

        if (!transaction) {
            throw new Error('記録が見つかりません');
        }

        const updateData: any = {};
        if (data.category_id !== undefined) updateData.category_id = data.category_id;
        if (data.type !== undefined) updateData.type = data.type;
        if (data.amount !== undefined) updateData.amount = data.amount;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.transaction_date !== undefined) updateData.transaction_date = data.transaction_date;

        await transaction.update(updateData);

        // 更新された記録を再取得（関連情報を含む）
        return await this.findById(id);
    },

    /**
     * 記録を削除する
     * 
     * @param id 記録ID
     * @param userId ユーザーID
     */
    async delete(id: number, userId: number) {
        const transaction = await db.transactions.findOne({
            where: {
                id,
                user_id: userId
            }
        });

        if (!transaction) {
            throw new Error('記録が見つかりません');
        }

        await transaction.destroy();
    },

    /**
     * 記録の統計情報を取得する
     * 
     * @param userId ユーザーID
     * @param startDate 開始日（オプション）
     * @param endDate 終了日（オプション）
     * @returns 統計情報
     */
    async getStats(userId: number, startDate?: string, endDate?: string) {
        const where: any = {
            user_id: userId
        };

        if (startDate || endDate) {
            where.transaction_date = {};
            if (startDate) {
                where.transaction_date[Op.gte] = startDate;
            }
            if (endDate) {
                where.transaction_date[Op.lte] = endDate;
            }
        }

        const transactions = await db.transactions.findAll({
            where,
            attributes: ['type', 'amount']
        });

        let totalIncome = 0;
        let totalExpense = 0;

        transactions.forEach((transaction: any) => {
            const amount = parseFloat(transaction.amount);
            if (transaction.type === 'income') {
                totalIncome += amount;
            } else {
                totalExpense += amount;
            }
        });

        return {
            totalIncome,
            totalExpense,
            balance: totalIncome - totalExpense
        };
    }
};

