import { Request, Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
import { recipeRepository } from '../../repositories/recipeRepository';
import { stockRepository } from '../../repositories/stockRepository';

/**
 * 在庫にある食材でおすすめレシピを取得
 */
export const getRecommendedRecipesController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                error: '認証が必要です' 
            });
        }

        // ユーザーの在庫を取得
        const stocks = await stockRepository.findByUserId(userId);
        
        // 在庫にある食材IDのリストを作成
        const stockFoodIds = stocks.map(stock => stock.food_id);
        
        if (stockFoodIds.length === 0) {
            return res.status(200).json([]);
        }

        // 在庫にある食材でレシピを取得
        const recipes = await recipeRepository.findByStockFoods(stockFoodIds);
        
        res.status(200).json(recipes);
    } catch (error) {
        console.error('Get recommended recipes error:', error);
        res.status(500).json({ error: 'おすすめレシピの取得中にエラーが発生しました' });
    }
};

/**
 * レシピ一覧を取得（ユーザー用）
 */
export const getRecipesController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                error: '認証が必要です' 
            });
        }

        const recipes = await recipeRepository.findAll();
        res.status(200).json(recipes);
    } catch (error) {
        console.error('Get recipes error:', error);
        res.status(500).json({ error: 'レシピの取得中にエラーが発生しました' });
    }
};

/**
 * レシピを取得（ID指定、ユーザー用）
 */
export const getRecipeByIdController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                error: '認証が必要です' 
            });
        }

        const { id } = req.params;
        const recipeId = parseInt(id, 10);
        
        if (isNaN(recipeId)) {
            return res.status(400).json({ 
                error: '無効なレシピIDです' 
            });
        }

        const recipe = await recipeRepository.findById(recipeId);
        
        if (!recipe) {
            return res.status(404).json({ 
                error: 'レシピが見つかりません' 
            });
        }

        res.status(200).json(recipe);
    } catch (error) {
        console.error('Get recipe by id error:', error);
        res.status(500).json({ error: 'レシピの取得中にエラーが発生しました' });
    }
};

