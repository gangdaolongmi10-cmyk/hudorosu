import { Request, Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
import { recipeRepository } from '../../repositories/recipeRepository';

/**
 * 料理一覧を取得
 */
export const recipesController = async (req: AuthRequest, res: Response) => {
    try {
        const recipes = await recipeRepository.findAll();
        res.status(200).json(recipes);
    } catch (error) {
        console.error('Recipe Fetch Error:', error);
        res.status(500).json({ error: '料理の取得中にエラーが発生しました' });
    }
};

/**
 * 料理を取得（ID指定）
 */
export const getRecipeController = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ 
                error: '料理IDが必要です' 
            });
        }

        const recipeId = parseInt(id, 10);
        if (isNaN(recipeId)) {
            return res.status(400).json({ 
                error: '無効な料理IDです' 
            });
        }

        const recipe = await recipeRepository.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ 
                error: '料理が見つかりません' 
            });
        }

        // アレルギー情報も取得
        const allergens = await recipeRepository.getAllergensByRecipeId(recipeId);

        res.status(200).json({
            ...recipe.toJSON(),
            allergens
        });
    } catch (error) {
        console.error('Get recipe error:', error);
        res.status(500).json({ 
            error: '料理の取得中にエラーが発生しました' 
        });
    }
};

/**
 * 料理を作成
 */
export const createRecipeController = async (req: AuthRequest, res: Response) => {
    try {
        const { name, description, image_url, cooking_time, servings, instructions, foods } = req.body;

        // バリデーション
        if (!name || name.trim() === '') {
            return res.status(400).json({ 
                error: '料理名を入力してください' 
            });
        }

        // 食材のバリデーション
        let recipeFoods: Array<{ food_id: number; quantity?: string | null }> | undefined;
        if (foods && Array.isArray(foods)) {
            recipeFoods = foods.map((food: any) => {
                const foodId = parseInt(food.food_id || food.id, 10);
                if (isNaN(foodId)) {
                    throw new Error('無効な食材IDです');
                }
                return {
                    food_id: foodId,
                    quantity: food.quantity || null
                };
            });
        }

        const recipe = await recipeRepository.create({
            name: name.trim(),
            description: description || null,
            image_url: image_url || null,
            cooking_time: cooking_time ? parseInt(cooking_time, 10) : null,
            servings: servings ? parseInt(servings, 10) : null,
            instructions: instructions || null,
        }, recipeFoods);

        // アレルギー情報も取得
        const allergens = await recipeRepository.getAllergensByRecipeId(recipe.id);

        res.status(201).json({
            ...recipe.toJSON(),
            allergens
        });
    } catch (error: any) {
        console.error('Create recipe error:', error);
        if (error.message && error.message.includes('無効な食材ID')) {
            return res.status(400).json({ 
                error: error.message 
            });
        }
        res.status(500).json({ 
            error: '料理の作成中にエラーが発生しました' 
        });
    }
};

/**
 * 料理を更新
 */
export const updateRecipeController = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, image_url, cooking_time, servings, instructions, foods } = req.body;

        // バリデーション
        if (!id) {
            return res.status(400).json({ 
                error: '料理IDが必要です' 
            });
        }

        const recipeId = parseInt(id, 10);
        if (isNaN(recipeId)) {
            return res.status(400).json({ 
                error: '無効な料理IDです' 
            });
        }

        // 料理の存在確認
        const existingRecipe = await recipeRepository.findById(recipeId);
        if (!existingRecipe) {
            return res.status(404).json({ 
                error: '料理が見つかりません' 
            });
        }

        // 更新データを準備
        const updateData: any = {};
        if (name !== undefined) updateData.name = name.trim();
        if (description !== undefined) updateData.description = description || null;
        if (image_url !== undefined) updateData.image_url = image_url || null;
        if (cooking_time !== undefined) updateData.cooking_time = cooking_time ? parseInt(cooking_time, 10) : null;
        if (servings !== undefined) updateData.servings = servings ? parseInt(servings, 10) : null;
        if (instructions !== undefined) updateData.instructions = instructions || null;

        // 食材のバリデーション
        let recipeFoods: Array<{ food_id: number; quantity?: string | null }> | undefined;
        if (foods !== undefined) {
            if (Array.isArray(foods)) {
                recipeFoods = foods.map((food: any) => {
                    const foodId = parseInt(food.food_id || food.id, 10);
                    if (isNaN(foodId)) {
                        throw new Error('無効な食材IDです');
                    }
                    return {
                        food_id: foodId,
                        quantity: food.quantity || null
                    };
                });
            } else {
                recipeFoods = [];
            }
        }

        const updatedRecipe = await recipeRepository.update(recipeId, updateData, recipeFoods);

        // アレルギー情報も取得
        const allergens = await recipeRepository.getAllergensByRecipeId(recipeId);

        res.status(200).json({
            ...updatedRecipe.toJSON(),
            allergens
        });
    } catch (error: any) {
        console.error('Update recipe error:', error);
        if (error.message === '料理が見つかりません') {
            return res.status(404).json({ 
                error: error.message 
            });
        }
        if (error.message && error.message.includes('無効な食材ID')) {
            return res.status(400).json({ 
                error: error.message 
            });
        }
        res.status(500).json({ 
            error: '料理の更新中にエラーが発生しました' 
        });
    }
};

/**
 * 料理を削除
 */
export const deleteRecipeController = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        // バリデーション
        if (!id) {
            return res.status(400).json({ 
                error: '料理IDが必要です' 
            });
        }

        const recipeId = parseInt(id, 10);
        if (isNaN(recipeId)) {
            return res.status(400).json({ 
                error: '無効な料理IDです' 
            });
        }

        // 料理の存在確認
        const existingRecipe = await recipeRepository.findById(recipeId);
        if (!existingRecipe) {
            return res.status(404).json({ 
                error: '料理が見つかりません' 
            });
        }

        await recipeRepository.delete(recipeId);

        res.status(200).json({ 
            message: '料理が正常に削除されました' 
        });
    } catch (error: any) {
        console.error('Delete recipe error:', error);
        if (error.message === '料理が見つかりません') {
            return res.status(404).json({ 
                error: error.message 
            });
        }
        res.status(500).json({ 
            error: '料理の削除中にエラーが発生しました' 
        });
    }
};

/**
 * 料理のアレルギー情報を取得
 */
export const getRecipeAllergensController = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ 
                error: '料理IDが必要です' 
            });
        }

        const recipeId = parseInt(id, 10);
        if (isNaN(recipeId)) {
            return res.status(400).json({ 
                error: '無効な料理IDです' 
            });
        }

        // 料理の存在確認
        const existingRecipe = await recipeRepository.findById(recipeId);
        if (!existingRecipe) {
            return res.status(404).json({ 
                error: '料理が見つかりません' 
            });
        }

        const allergens = await recipeRepository.getAllergensByRecipeId(recipeId);

        res.status(200).json(allergens);
    } catch (error) {
        console.error('Get recipe allergens error:', error);
        res.status(500).json({ 
            error: 'アレルギー情報の取得中にエラーが発生しました' 
        });
    }
};

