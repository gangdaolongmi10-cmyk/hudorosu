import { Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
import { favoriteRepository } from '../../repositories/favoriteRepository';

/**
 * お気に入りレシピ一覧を取得
 */
export const getFavoritesController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                error: '認証が必要です' 
            });
        }

        const favorites = await favoriteRepository.findByUserId(userId);
        res.status(200).json(favorites);
    } catch (error) {
        console.error('Get favorites error:', error);
        res.status(500).json({ error: 'お気に入りの取得中にエラーが発生しました' });
    }
};

/**
 * お気に入りに追加
 */
export const addFavoriteController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                error: '認証が必要です' 
            });
        }

        const { recipe_id } = req.body;

        if (!recipe_id) {
            return res.status(400).json({ 
                error: 'レシピIDが必要です' 
            });
        }

        const recipeId = parseInt(recipe_id, 10);
        if (isNaN(recipeId)) {
            return res.status(400).json({ 
                error: '無効なレシピIDです' 
            });
        }

        await favoriteRepository.add(userId, recipeId);
        res.status(201).json({ 
            message: 'お気に入りに追加しました' 
        });
    } catch (error: any) {
        console.error('Add favorite error:', error);
        if (error.message === '既にお気に入りに登録されています') {
            return res.status(400).json({ 
                error: error.message 
            });
        }
        res.status(500).json({ error: 'お気に入りの追加中にエラーが発生しました' });
    }
};

/**
 * お気に入りから削除
 */
export const removeFavoriteController = async (req: AuthRequest, res: Response) => {
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

        await favoriteRepository.remove(userId, recipeId);
        res.status(200).json({ 
            message: 'お気に入りから削除しました' 
        });
    } catch (error: any) {
        console.error('Remove favorite error:', error);
        if (error.message === 'お気に入りに登録されていません') {
            return res.status(404).json({ 
                error: error.message 
            });
        }
        res.status(500).json({ error: 'お気に入りの削除中にエラーが発生しました' });
    }
};

/**
 * お気に入りのトグル（追加/削除を切り替え）
 */
export const toggleFavoriteController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                error: '認証が必要です' 
            });
        }

        const { recipe_id } = req.body;

        if (!recipe_id) {
            return res.status(400).json({ 
                error: 'レシピIDが必要です' 
            });
        }

        const recipeId = parseInt(recipe_id, 10);
        if (isNaN(recipeId)) {
            return res.status(400).json({ 
                error: '無効なレシピIDです' 
            });
        }

        const isAdded = await favoriteRepository.toggle(userId, recipeId);
        res.status(200).json({ 
            is_favorite: isAdded,
            message: isAdded ? 'お気に入りに追加しました' : 'お気に入りから削除しました'
        });
    } catch (error) {
        console.error('Toggle favorite error:', error);
        res.status(500).json({ error: 'お気に入りの更新中にエラーが発生しました' });
    }
};

/**
 * レシピIDの配列について、お気に入り状態を取得
 */
export const getFavoriteStatusController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                error: '認証が必要です' 
            });
        }

        const { recipe_ids } = req.query;
        
        if (!recipe_ids || typeof recipe_ids !== 'string') {
            return res.status(400).json({ 
                error: 'レシピIDの配列が必要です' 
            });
        }

        const recipeIds = recipe_ids.split(',').map((id: string) => parseInt(id.trim(), 10)).filter((id: number) => !isNaN(id));
        
        if (recipeIds.length === 0) {
            return res.status(200).json({ favorite_recipe_ids: [] });
        }

        const favoriteRecipeIds = await favoriteRepository.getFavoriteRecipeIds(userId, recipeIds);
        res.status(200).json({ favorite_recipe_ids: favoriteRecipeIds });
    } catch (error) {
        console.error('Get favorite status error:', error);
        res.status(500).json({ error: 'お気に入り状態の取得中にエラーが発生しました' });
    }
};
