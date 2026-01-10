import { Request, Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
import { recipeRepository } from '../../repositories/recipeRepository';
import { stockRepository } from '../../repositories/stockRepository';
import { userRepository } from '../../repositories/userRepository';
import { favoriteRepository } from '../../repositories/favoriteRepository';

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
        
        // お気に入り状態を取得
        const recipeIds = recipes.map((recipe: any) => recipe.id);
        const favoriteRecipeIds = recipeIds.length > 0 
            ? await favoriteRepository.getFavoriteRecipeIds(userId, recipeIds)
            : [];
        
        // レシピにお気に入り状態を追加
        const recipesWithFavorite = recipes.map((recipe: any) => ({
            ...recipe,
            is_favorite: favoriteRecipeIds.includes(recipe.id)
        }));
        
        res.status(200).json(recipesWithFavorite);
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

        // レシピ料金を計算
        const price = await recipeRepository.calculatePrice(recipeId);
        
        // お気に入り状態を取得
        const isFavorite = await favoriteRepository.isFavorite(userId, recipeId);
        
        const recipeData = recipe.toJSON ? recipe.toJSON() : recipe;
        res.status(200).json({
            ...recipeData,
            total_price: price,
            is_favorite: isFavorite
        });
    } catch (error) {
        console.error('Get recipe by id error:', error);
        res.status(500).json({ error: 'レシピの取得中にエラーが発生しました' });
    }
};

/**
 * 1日の食費予算に基づいておすすめレシピを取得
 */
export const getRecommendedRecipesByBudgetController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                error: '認証が必要です' 
            });
        }

        // ユーザーの食費予算を取得
        const user = await userRepository.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                error: 'ユーザーが見つかりません' 
            });
        }

        // ユーザーの在庫を取得
        const stocks = await stockRepository.findByUserId(userId);
        
        // 在庫にある食材IDのリストを作成
        const stockFoodIds = stocks.map(stock => stock.food_id);
        
        if (stockFoodIds.length === 0) {
            return res.status(200).json({
                recipes: [],
                daily_food_budget: user.daily_food_budget,
                message: '在庫がありません。在庫を追加すると、おすすめレシピが表示されます。'
            });
        }

        // 在庫にある食材でレシピを取得
        const recipes = await recipeRepository.findByStockFoods(stockFoodIds);
        
        // お気に入り状態を取得
        const recipeIds = recipes.map((recipe: any) => recipe.id);
        const favoriteRecipeIds = recipeIds.length > 0 
            ? await favoriteRepository.getFavoriteRecipeIds(userId, recipeIds)
            : [];
        
        // レシピにお気に入り状態を追加
        const recipesWithFavorite = recipes.map((recipe: any) => ({
            ...recipe,
            is_favorite: favoriteRecipeIds.includes(recipe.id)
        }));
        
        res.status(200).json({
            recipes: recipesWithFavorite,
            daily_food_budget: user.daily_food_budget,
            message: user.daily_food_budget 
                ? `1日の食費予算: ¥${user.daily_food_budget.toLocaleString()}に基づいたおすすめレシピです`
                : '在庫にある食材から作れるレシピです'
        });
    } catch (error) {
        console.error('Get recommended recipes by budget error:', error);
        res.status(500).json({ error: 'おすすめレシピの取得中にエラーが発生しました' });
    }
};

/**
 * レシピを削除（ユーザー用）
 */
export const deleteRecipeController = async (req: AuthRequest, res: Response) => {
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

        // レシピの存在確認
        const existingRecipe = await recipeRepository.findById(recipeId);
        if (!existingRecipe) {
            return res.status(404).json({ 
                error: 'レシピが見つかりません' 
            });
        }

        await recipeRepository.delete(recipeId);

        res.status(200).json({ 
            message: 'レシピが正常に削除されました' 
        });
    } catch (error: any) {
        console.error('Delete recipe error:', error);
        if (error.message === '料理が見つかりません') {
            return res.status(404).json({ 
                error: error.message 
            });
        }
        res.status(500).json({ 
            error: 'レシピの削除中にエラーが発生しました' 
        });
    }
};

