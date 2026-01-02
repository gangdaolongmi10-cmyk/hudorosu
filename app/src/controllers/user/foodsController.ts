import { Request, Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
import { foodRepository } from '../../repositories/foodRepository';
import { categoryRepository } from '../../repositories/categoryRepository';

/**
 * マスタ食材一覧を取得（認証済みユーザー向け）
 */
export const getMasterFoodsController = async (req: AuthRequest, res: Response) => {
    try {
        const foods = await foodRepository.findAllMasterFoods();
        res.status(200).json(foods);
    } catch (error) {
        console.error('Get master foods error:', error);
        res.status(500).json({ error: '食材の取得中にエラーが発生しました' });
    }
};

/**
 * カテゴリー別マスタ食材を取得（認証済みユーザー向け）
 */
export const getMasterFoodsByCategoryController = async (req: AuthRequest, res: Response) => {
    try {
        const { categoryId } = req.params;
        const { limit = '20', offset = '0' } = req.query;

        if (!categoryId) {
            return res.status(400).json({ 
                error: 'カテゴリーIDが必要です' 
            });
        }

        const catId = parseInt(categoryId, 10);
        if (isNaN(catId)) {
            return res.status(400).json({ 
                error: '無効なカテゴリーIDです' 
            });
        }

        const limitNum = parseInt(limit as string, 10);
        const offsetNum = parseInt(offset as string, 10);

        if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
            return res.status(400).json({ 
                error: '無効なlimit値です（1-100の範囲）' 
            });
        }

        if (isNaN(offsetNum) || offsetNum < 0) {
            return res.status(400).json({ 
                error: '無効なoffset値です' 
            });
        }

        const category = await categoryRepository.findById(catId);
        if (!category) {
            return res.status(404).json({ 
                error: 'カテゴリーが見つかりません' 
            });
        }

        const result = await foodRepository.findByCategoryId(catId, limitNum, offsetNum);

        res.status(200).json({
            foods: result.foods,
            total: result.total,
            limit: limitNum,
            offset: offsetNum
        });
    } catch (error) {
        console.error('Get master foods by category error:', error);
        res.status(500).json({ 
            error: '食材の取得中にエラーが発生しました' 
        });
    }
};

/**
 * ユーザー固有の食材を作成
 */
export const createUserFoodController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                error: '認証が必要です' 
            });
        }

        const { name, category_id, best_before_date, expiry_date, memo, allergen_ids } = req.body;

        // バリデーション
        if (!name || name.trim() === '') {
            return res.status(400).json({ 
                error: '食材名を入力してください' 
            });
        }

        if (!category_id) {
            return res.status(400).json({ 
                error: 'カテゴリーを選択してください' 
            });
        }

        const categoryId = parseInt(category_id, 10);
        if (isNaN(categoryId)) {
            return res.status(400).json({ 
                error: '無効なカテゴリーIDです' 
            });
        }

        // カテゴリーの存在確認
        const category = await categoryRepository.findById(categoryId);
        if (!category) {
            return res.status(404).json({ 
                error: 'カテゴリーが見つかりません' 
            });
        }

        // アレルゲンIDの配列を処理
        let allergenIds: number[] | undefined;
        if (allergen_ids && Array.isArray(allergen_ids)) {
            allergenIds = allergen_ids.map((id: any) => parseInt(id, 10)).filter((id: number) => !isNaN(id));
        }

        const db = require('../../../models');
        const transaction = await db.sequelize.transaction();
        
        try {
            console.log('Creating user food:', {
                userId,
                name: name.trim(),
                category_id: categoryId,
                best_before_date: best_before_date || null,
                expiry_date: expiry_date || null,
                memo: memo || null,
                allergen_ids: allergenIds,
            });

            // ユーザー固有の食材を作成
            const food = await db.foods.create({
                name: name.trim(),
                category_id: categoryId,
                user_id: userId,
                best_before_date: best_before_date && best_before_date.trim() !== '' ? best_before_date : null,
                expiry_date: expiry_date && expiry_date.trim() !== '' ? expiry_date : null,
                memo: memo && memo.trim() !== '' ? memo.trim() : null,
            }, { transaction });

            console.log('Food created with ID:', food.id);

            // アレルゲンを紐付け
            if (allergenIds && allergenIds.length > 0) {
                await food.setAllergen_id_allergens(allergenIds, { transaction });
                console.log('Allergens linked:', allergenIds);
            }

            await transaction.commit();
            console.log('Transaction committed successfully');

            // 作成された食材を再取得（関連情報を含む）
            const createdFood = await db.foods.findOne({
                where: { id: food.id },
                include: [
                    {
                        model: db.categories,
                        as: 'category',
                        attributes: ['id', 'name', 'description']
                    },
                    {
                        model: db.allergens,
                        as: 'allergen_id_allergens',
                        attributes: ['id', 'name'],
                        through: {
                            attributes: []
                        }
                    }
                ],
                attributes: ['id', 'name', 'category_id', 'user_id', 'best_before_date', 'expiry_date', 'memo', 'created_at', 'updated_at']
            });

            console.log('Food saved to database successfully:', createdFood.id);
            res.status(201).json(createdFood);
        } catch (error: any) {
            await transaction.rollback();
            console.error('Transaction rolled back. Error:', error);
            throw error;
        }
    } catch (error: any) {
        console.error('Create user food error:', error);
        console.error('Error details:', {
            message: error.message,
            name: error.name,
            stack: error.stack,
        });
        
        // データベースエラーの場合、より詳細なエラーメッセージを返す
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
            error: error.message || '食材の作成中にエラーが発生しました' 
        });
    }
};

