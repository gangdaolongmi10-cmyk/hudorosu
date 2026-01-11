import { Request, Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
import { categoryRepository } from '../../repositories/categoryRepository';

export const categoriesController = async (req: AuthRequest, res: Response) => {
    try {
        const categories = await categoryRepository.findAll();
        res.status(200).json(categories);
    } catch (error) {
        console.error('Category Fetch Error:', error);
        res.status(500).json({ error: 'カテゴリーの取得中にエラーが発生しました' });
    }
};

/**
 * カテゴリーを作成
 */
export const createCategoryController = async (req: AuthRequest, res: Response) => {
    try {
        const { name, description } = req.body;

        // バリデーション
        if (!name || name.trim() === '') {
            return res.status(400).json({ 
                error: 'カテゴリー名を入力してください' 
            });
        }

        // カテゴリー名の重複チェック
        const db = require('../../../models');
        const existingCategory = await db.categories.findOne({
            where: { name: name.trim() }
        });
        
        if (existingCategory) {
            return res.status(400).json({ 
                error: 'このカテゴリー名は既に使用されています' 
            });
        }

        const category = await categoryRepository.create({
            name: name.trim(),
            description: description || null,
        });

        res.status(201).json({
            id: category.id,
            name: category.name,
            description: category.description,
            foodCount: 0
        });
    } catch (error: any) {
        console.error('Create category error:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ 
                error: 'このカテゴリー名は既に使用されています' 
            });
        }
        res.status(500).json({ 
            error: 'カテゴリーの作成中にエラーが発生しました' 
        });
    }
};

/**
 * カテゴリーを更新
 */
export const updateCategoryController = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        // バリデーション
        if (!id) {
            return res.status(400).json({ 
                error: 'カテゴリーIDが必要です' 
            });
        }

        const categoryId = parseInt(id, 10);
        if (isNaN(categoryId)) {
            return res.status(400).json({ 
                error: '無効なカテゴリーIDです' 
            });
        }

        if (!name || name.trim() === '') {
            return res.status(400).json({ 
                error: 'カテゴリー名を入力してください' 
            });
        }

        // カテゴリーの存在確認
        const existingCategory = await categoryRepository.findById(categoryId);
        if (!existingCategory) {
            return res.status(404).json({ 
                error: 'カテゴリーが見つかりません' 
            });
        }

        // カテゴリー名の重複チェック（自分自身を除く）
        const db = require('../../../models');
        const duplicateCategory = await db.categories.findOne({
            where: { 
                name: name.trim(),
                id: { [db.Sequelize.Op.ne]: categoryId }
            }
        });
        if (duplicateCategory) {
            return res.status(400).json({ 
                error: 'このカテゴリー名は既に使用されています' 
            });
        }

        const updatedCategory = await categoryRepository.update(categoryId, {
            name: name.trim(),
            description: description !== undefined ? description : existingCategory.description,
        });

        // 食材数も取得
        const foodCount = await db.foods.count({
            where: {
                category_id: categoryId,
                user_id: null
            }
        });

        res.status(200).json({
            id: updatedCategory.id,
            name: updatedCategory.name,
            description: updatedCategory.description,
            foodCount
        });
    } catch (error: any) {
        console.error('Update category error:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ 
                error: 'このカテゴリー名は既に使用されています' 
            });
        }
        res.status(500).json({ 
            error: 'カテゴリーの更新中にエラーが発生しました' 
        });
    }
};

/**
 * カテゴリーを削除
 */
export const deleteCategoryController = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        // バリデーション
        if (!id) {
            return res.status(400).json({ 
                error: 'カテゴリーIDが必要です' 
            });
        }

        const categoryId = parseInt(id, 10);
        if (isNaN(categoryId)) {
            return res.status(400).json({ 
                error: '無効なカテゴリーIDです' 
            });
        }

        // カテゴリーの存在確認
        const existingCategory = await categoryRepository.findById(categoryId);
        if (!existingCategory) {
            return res.status(404).json({ 
                error: 'カテゴリーが見つかりません' 
            });
        }

        // 関連する食材が存在するか確認（マスタ食材のみ）
        const db = require('../../../models');
        const foodCount = await db.foods.count({
            where: {
                category_id: categoryId,
                user_id: null
            }
        });

        if (foodCount > 0) {
            return res.status(400).json({ 
                error: `このカテゴリーには${foodCount}件の食材が紐づいています。先に食材を削除または別のカテゴリーに移動してください。` 
            });
        }

        await categoryRepository.delete(categoryId);

        res.status(200).json({ 
            message: 'カテゴリーが正常に削除されました' 
        });
    } catch (error: any) {
        console.error('Delete category error:', error);
        if (error.message === 'カテゴリーが見つかりません') {
            return res.status(404).json({ 
                error: error.message 
            });
        }
        res.status(500).json({ 
            error: 'カテゴリーの削除中にエラーが発生しました' 
        });
    }
};