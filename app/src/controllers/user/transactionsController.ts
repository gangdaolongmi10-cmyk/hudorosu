import { Request, Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
import { transactionRepository } from '../../repositories/transactionRepository';

/**
 * ユーザーの記録一覧を取得
 */
export const getTransactionsController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                error: '認証が必要です' 
            });
        }

        const { type, category_id, start_date, end_date } = req.query;
        
        const filters: any = {};
        if (type && type !== 'all') {
            filters.type = type as 'income' | 'expense';
        }
        if (category_id) {
            const categoryId = parseInt(category_id as string, 10);
            if (!isNaN(categoryId)) {
                filters.category_id = categoryId;
            }
        }
        if (start_date) {
            filters.start_date = start_date as string;
        }
        if (end_date) {
            filters.end_date = end_date as string;
        }

        const transactions = await transactionRepository.findByUserId(userId, filters);
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ error: '記録の取得中にエラーが発生しました' });
    }
};

/**
 * 記録を取得（ID指定）
 */
export const getTransactionByIdController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                error: '認証が必要です' 
            });
        }

        const { id } = req.params;
        const transactionId = parseInt(id, 10);
        
        if (isNaN(transactionId)) {
            return res.status(400).json({ 
                error: '無効な記録IDです' 
            });
        }

        const transaction = await transactionRepository.findById(transactionId, userId);
        
        if (!transaction) {
            return res.status(404).json({ 
                error: '記録が見つかりません' 
            });
        }

        res.status(200).json(transaction);
    } catch (error) {
        console.error('Get transaction by id error:', error);
        res.status(500).json({ error: '記録の取得中にエラーが発生しました' });
    }
};

/**
 * 記録を作成
 */
export const createTransactionController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                error: '認証が必要です' 
            });
        }

        const { category_id, type, amount, description, transaction_date } = req.body;

        // バリデーション
        if (!type || !['income', 'expense'].includes(type)) {
            return res.status(400).json({ 
                error: '記録タイプを指定してください（income または expense）' 
            });
        }

        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            return res.status(400).json({ 
                error: '有効な金額を指定してください' 
            });
        }

        if (!transaction_date) {
            return res.status(400).json({ 
                error: '記録日を指定してください' 
            });
        }

        const transaction = await transactionRepository.create({
            user_id: userId,
            category_id: category_id || null,
            type: type,
            amount: parseFloat(amount),
            description: description || null,
            transaction_date: transaction_date,
        });

        res.status(201).json(transaction);
    } catch (error: any) {
        console.error('Create transaction error:', error);
        
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                error: 'バリデーションエラー: ' + error.errors.map((e: any) => e.message).join(', ')
            });
        }
        
        if (error.name === 'SequelizeDatabaseError') {
            return res.status(500).json({ 
                error: 'データベースエラーが発生しました' 
            });
        }

        res.status(500).json({ 
            error: error.message || '記録の作成中にエラーが発生しました' 
        });
    }
};

/**
 * 記録を更新
 */
export const updateTransactionController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                error: '認証が必要です' 
            });
        }

        const { id } = req.params;
        const transactionId = parseInt(id, 10);
        
        if (isNaN(transactionId)) {
            return res.status(400).json({ 
                error: '無効な記録IDです' 
            });
        }

        const { category_id, type, amount, description, transaction_date } = req.body;

        // バリデーション
        if (type && !['income', 'expense'].includes(type)) {
            return res.status(400).json({ 
                error: '無効な記録タイプです（income または expense）' 
            });
        }

        if (amount !== undefined && (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0)) {
            return res.status(400).json({ 
                error: '有効な金額を指定してください' 
            });
        }

        const updateData: any = {};
        if (category_id !== undefined) updateData.category_id = category_id;
        if (type !== undefined) updateData.type = type;
        if (amount !== undefined) updateData.amount = parseFloat(amount);
        if (description !== undefined) updateData.description = description;
        if (transaction_date !== undefined) updateData.transaction_date = transaction_date;

        const transaction = await transactionRepository.update(transactionId, userId, updateData);
        res.status(200).json(transaction);
    } catch (error: any) {
        console.error('Update transaction error:', error);
        
        if (error.message === '記録が見つかりません') {
            return res.status(404).json({ 
                error: error.message 
            });
        }
        
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                error: 'バリデーションエラー: ' + error.errors.map((e: any) => e.message).join(', ')
            });
        }

        res.status(500).json({ 
            error: error.message || '記録の更新中にエラーが発生しました' 
        });
    }
};

/**
 * 記録を削除
 */
export const deleteTransactionController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                error: '認証が必要です' 
            });
        }

        const { id } = req.params;
        const transactionId = parseInt(id, 10);
        
        if (isNaN(transactionId)) {
            return res.status(400).json({ 
                error: '無効な記録IDです' 
            });
        }

        await transactionRepository.delete(transactionId, userId);
        res.status(204).send();
    } catch (error: any) {
        console.error('Delete transaction error:', error);
        
        if (error.message === '記録が見つかりません') {
            return res.status(404).json({ 
                error: error.message 
            });
        }
        
        res.status(500).json({ 
            error: error.message || '記録の削除中にエラーが発生しました' 
        });
    }
};

/**
 * 記録の統計情報を取得
 */
export const getTransactionStatsController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                error: '認証が必要です' 
            });
        }

        const { start_date, end_date } = req.query;

        const stats = await transactionRepository.getStats(
            userId,
            start_date as string | undefined,
            end_date as string | undefined
        );

        res.status(200).json(stats);
    } catch (error) {
        console.error('Get transaction stats error:', error);
        res.status(500).json({ error: '統計情報の取得中にエラーが発生しました' });
    }
};

