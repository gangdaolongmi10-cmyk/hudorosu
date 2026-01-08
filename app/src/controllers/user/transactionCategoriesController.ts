import { Request, Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
import { transactionCategoryRepository } from '../../repositories/transactionCategoryRepository';

/**
 * ユーザーのカテゴリ一覧を取得
 */
export const getTransactionCategoriesController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                error: '認証が必要です' 
            });
        }

        const categories = await transactionCategoryRepository.findByUserId(userId);
        res.status(200).json(categories);
    } catch (error) {
        console.error('Get transaction categories error:', error);
        res.status(500).json({ error: 'カテゴリの取得中にエラーが発生しました' });
    }
};

/**
 * カテゴリを取得（ID指定）
 */
export const getTransactionCategoryByIdController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                error: '認証が必要です' 
            });
        }

        const { id } = req.params;
        const categoryId = parseInt(id, 10);
        
        if (isNaN(categoryId)) {
            return res.status(400).json({ 
                error: '無効なカテゴリIDです' 
            });
        }

        const category = await transactionCategoryRepository.findById(categoryId, userId);
        
        if (!category) {
            return res.status(404).json({ 
                error: 'カテゴリが見つかりません' 
            });
        }

        res.status(200).json(category);
    } catch (error) {
        console.error('Get transaction category by id error:', error);
        res.status(500).json({ error: 'カテゴリの取得中にエラーが発生しました' });
    }
};

/**
 * カテゴリを作成
 */
export const createTransactionCategoryController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                error: '認証が必要です' 
            });
        }

        const { name, description, color } = req.body;

        // バリデーション
        if (!name || name.trim() === '') {
            return res.status(400).json({ 
                error: 'カテゴリ名を指定してください' 
            });
        }

        const category = await transactionCategoryRepository.create({
            user_id: userId,
            name: name.trim(),
            description: description || null,
            color: color || '#3B82F6',
        });

        res.status(201).json(category);
    } catch (error: any) {
        console.error('Create transaction category error:', error);
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ 
                error: 'このカテゴリ名は既に使用されています' 
            });
        }
        
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                error: 'バリデーションエラー: ' + error.errors.map((e: any) => e.message).join(', ')
            });
        }

        res.status(500).json({ 
            error: error.message || 'カテゴリの作成中にエラーが発生しました' 
        });
    }
};

/**
 * カテゴリを更新
 */
export const updateTransactionCategoryController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                error: '認証が必要です' 
            });
        }

        const { id } = req.params;
        const categoryId = parseInt(id, 10);
        
        if (isNaN(categoryId)) {
            return res.status(400).json({ 
                error: '無効なカテゴリIDです' 
            });
        }

        const { name, description, color } = req.body;

        // バリデーション
        if (name !== undefined && name.trim() === '') {
            return res.status(400).json({ 
                error: 'カテゴリ名を空にすることはできません' 
            });
        }

        const updateData: any = {};
        if (name !== undefined) updateData.name = name.trim();
        if (description !== undefined) updateData.description = description;
        if (color !== undefined) updateData.color = color;

        const category = await transactionCategoryRepository.update(categoryId, userId, updateData);
        res.status(200).json(category);
    } catch (error: any) {
        console.error('Update transaction category error:', error);
        
        if (error.message === 'カテゴリが見つかりません') {
            return res.status(404).json({ 
                error: error.message 
            });
        }
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ 
                error: 'このカテゴリ名は既に使用されています' 
            });
        }
        
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                error: 'バリデーションエラー: ' + error.errors.map((e: any) => e.message).join(', ')
            });
        }

        res.status(500).json({ 
            error: error.message || 'カテゴリの更新中にエラーが発生しました' 
        });
    }
};

/**
 * カテゴリを削除
 */
export const deleteTransactionCategoryController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                error: '認証が必要です' 
            });
        }

        const { id } = req.params;
        const categoryId = parseInt(id, 10);
        
        if (isNaN(categoryId)) {
            return res.status(400).json({ 
                error: '無効なカテゴリIDです' 
            });
        }

        await transactionCategoryRepository.delete(categoryId, userId);
        res.status(204).send();
    } catch (error: any) {
        console.error('Delete transaction category error:', error);
        
        if (error.message === 'カテゴリが見つかりません') {
            return res.status(404).json({ 
                error: error.message 
            });
        }
        
        res.status(500).json({ 
            error: error.message || 'カテゴリの削除中にエラーが発生しました' 
        });
    }
};

