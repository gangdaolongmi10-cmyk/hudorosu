import { Request, Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
import { foodRepository } from '../../repositories/foodRepository';

export const foodsController = async (req: Request, res: Response) => {
    try {
        const foods = await foodRepository.findAllMasterFoods();
        res.status(200).json(foods);
    } catch (error) {
        console.error('Food Fetch Error:', error);
        res.status(500).json({ error: '食材の取得中にエラーが発生しました' });
    }
};

/**
 * 食材を取得（ID指定）
 */
export const getFoodController = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ 
                error: '食材IDが必要です' 
            });
        }

        const foodId = parseInt(id, 10);
        if (isNaN(foodId)) {
            return res.status(400).json({ 
                error: '無効な食材IDです' 
            });
        }

        const food = await foodRepository.findById(foodId);
        if (!food) {
            return res.status(404).json({ 
                error: '食材が見つかりません' 
            });
        }

        res.status(200).json(food);
    } catch (error) {
        console.error('Get food error:', error);
        res.status(500).json({ 
            error: '食材の取得中にエラーが発生しました' 
        });
    }
};

/**
 * 食材を作成
 */
export const createFoodController = async (req: AuthRequest, res: Response) => {
    try {
        const { name, category_id, best_before_date, expiry_date, memo, allergen_ids, calories, protein, fat, carbohydrate, fiber, sodium, serving_size } = req.body;

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
        const db = require('../../../models');
        const category = await db.categories.findByPk(categoryId);
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

        const food = await foodRepository.create({
            name: name.trim(),
            category_id: categoryId,
            best_before_date: best_before_date || null,
            expiry_date: expiry_date || null,
            memo: memo || null,
            calories: calories !== undefined && calories !== null && calories !== '' ? parseFloat(calories) : null,
            protein: protein !== undefined && protein !== null && protein !== '' ? parseFloat(protein) : null,
            fat: fat !== undefined && fat !== null && fat !== '' ? parseFloat(fat) : null,
            carbohydrate: carbohydrate !== undefined && carbohydrate !== null && carbohydrate !== '' ? parseFloat(carbohydrate) : null,
            fiber: fiber !== undefined && fiber !== null && fiber !== '' ? parseFloat(fiber) : null,
            sodium: sodium !== undefined && sodium !== null && sodium !== '' ? parseFloat(sodium) : null,
            serving_size: serving_size !== undefined && serving_size !== null && serving_size !== '' ? parseFloat(serving_size) : null,
        }, allergenIds);

        res.status(201).json(food);
    } catch (error: any) {
        console.error('Create food error:', error);
        res.status(500).json({ 
            error: '食材の作成中にエラーが発生しました' 
        });
    }
};

/**
 * 食材を更新
 */
export const updateFoodController = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name, category_id, best_before_date, expiry_date, memo, allergen_ids, calories, protein, fat, carbohydrate, fiber, sodium, serving_size } = req.body;

        // バリデーション
        if (!id) {
            return res.status(400).json({ 
                error: '食材IDが必要です' 
            });
        }

        const foodId = parseInt(id, 10);
        if (isNaN(foodId)) {
            return res.status(400).json({ 
                error: '無効な食材IDです' 
            });
        }

        // 食材の存在確認
        const existingFood = await foodRepository.findById(foodId);
        if (!existingFood) {
            return res.status(404).json({ 
                error: '食材が見つかりません' 
            });
        }

        // カテゴリーIDのバリデーション（指定されている場合）
        if (category_id !== undefined) {
            const categoryId = parseInt(category_id, 10);
            if (isNaN(categoryId)) {
                return res.status(400).json({ 
                    error: '無効なカテゴリーIDです' 
                });
            }

            const db = require('../../../models');
            const category = await db.categories.findByPk(categoryId);
            if (!category) {
                return res.status(404).json({ 
                    error: 'カテゴリーが見つかりません' 
                });
            }
        }

        // 更新データを準備
        const updateData: any = {};
        if (name !== undefined) updateData.name = name.trim();
        if (category_id !== undefined) updateData.category_id = parseInt(category_id, 10);
        if (best_before_date !== undefined) updateData.best_before_date = best_before_date || null;
        if (expiry_date !== undefined) updateData.expiry_date = expiry_date || null;
        if (memo !== undefined) updateData.memo = memo || null;
        if (calories !== undefined) updateData.calories = calories !== null && calories !== '' ? parseFloat(calories) : null;
        if (protein !== undefined) updateData.protein = protein !== null && protein !== '' ? parseFloat(protein) : null;
        if (fat !== undefined) updateData.fat = fat !== null && fat !== '' ? parseFloat(fat) : null;
        if (carbohydrate !== undefined) updateData.carbohydrate = carbohydrate !== null && carbohydrate !== '' ? parseFloat(carbohydrate) : null;
        if (fiber !== undefined) updateData.fiber = fiber !== null && fiber !== '' ? parseFloat(fiber) : null;
        if (sodium !== undefined) updateData.sodium = sodium !== null && sodium !== '' ? parseFloat(sodium) : null;
        if (serving_size !== undefined) updateData.serving_size = serving_size !== null && serving_size !== '' ? parseFloat(serving_size) : null;

        // アレルゲンIDの配列を処理
        let allergenIds: number[] | undefined;
        if (allergen_ids !== undefined) {
            if (Array.isArray(allergen_ids)) {
                allergenIds = allergen_ids.map((id: any) => parseInt(id, 10)).filter((id: number) => !isNaN(id));
            } else {
                allergenIds = [];
            }
        }

        const updatedFood = await foodRepository.update(foodId, updateData, allergenIds);

        res.status(200).json(updatedFood);
    } catch (error: any) {
        console.error('Update food error:', error);
        if (error.message === '食材が見つかりません') {
            return res.status(404).json({ 
                error: error.message 
            });
        }
        res.status(500).json({ 
            error: '食材の更新中にエラーが発生しました' 
        });
    }
};

/**
 * 食材を削除
 */
export const deleteFoodController = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        // バリデーション
        if (!id) {
            return res.status(400).json({ 
                error: '食材IDが必要です' 
            });
        }

        const foodId = parseInt(id, 10);
        if (isNaN(foodId)) {
            return res.status(400).json({ 
                error: '無効な食材IDです' 
            });
        }

        // 食材の存在確認
        const existingFood = await foodRepository.findById(foodId);
        if (!existingFood) {
            return res.status(404).json({ 
                error: '食材が見つかりません' 
            });
        }

        await foodRepository.delete(foodId);

        res.status(200).json({ 
            message: '食材が正常に削除されました' 
        });
    } catch (error: any) {
        console.error('Delete food error:', error);
        if (error.message === '食材が見つかりません') {
            return res.status(404).json({ 
                error: error.message 
            });
        }
        res.status(500).json({ 
            error: '食材の削除中にエラーが発生しました' 
        });
    }
};

/**
 * カテゴリーIDで食材をページネーションで取得
 */
export const getFoodsByCategoryController = async (req: AuthRequest, res: Response) => {
    try {
        const { categoryId } = req.params;
        const { limit = '20', offset = '0' } = req.query;

        // バリデーション
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

        // カテゴリーの存在確認
        const db = require('../../../models');
        const category = await db.categories.findByPk(catId);
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
        console.error('Get foods by category error:', error);
        res.status(500).json({ 
            error: '食材の取得中にエラーが発生しました' 
        });
    }
};

