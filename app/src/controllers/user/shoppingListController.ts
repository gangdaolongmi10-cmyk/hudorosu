import { Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
import { shoppingListRepository } from '../../repositories/shoppingListRepository';

/**
 * 買い物リストを取得
 */
export const getShoppingListController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                error: '認証が必要です' 
            });
        }

        const includePurchased = req.query.include_purchased === 'true';
        const items = await shoppingListRepository.findByUserId(userId, includePurchased);
        
        res.status(200).json(items);
    } catch (error) {
        console.error('Get shopping list error:', error);
        res.status(500).json({ error: '買い物リストの取得中にエラーが発生しました' });
    }
};

/**
 * 買い物リストアイテムを作成
 */
export const createShoppingListItemController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                error: '認証が必要です' 
            });
        }

        const { food_id, quantity, memo } = req.body;

        if (!food_id) {
            return res.status(400).json({ 
                error: '食材IDが必要です' 
            });
        }

        const item = await shoppingListRepository.create(userId, {
            food_id: parseInt(food_id, 10),
            quantity: quantity || null,
            memo: memo || null
        });

        const createdItem = await shoppingListRepository.findById(item.id);
        res.status(201).json(createdItem);
    } catch (error) {
        console.error('Create shopping list item error:', error);
        res.status(500).json({ error: '買い物リストアイテムの作成中にエラーが発生しました' });
    }
};

/**
 * 買い物リストアイテムを更新
 */
export const updateShoppingListItemController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                error: '認証が必要です' 
            });
        }

        const { id } = req.params;
        const itemId = parseInt(id, 10);
        
        if (isNaN(itemId)) {
            return res.status(400).json({ 
                error: '無効なアイテムIDです' 
            });
        }

        // アイテムの所有権を確認
        const existingItem = await shoppingListRepository.findById(itemId);
        if (!existingItem) {
            return res.status(404).json({ 
                error: '買い物リストアイテムが見つかりません' 
            });
        }

        if (existingItem.user_id !== userId) {
            return res.status(403).json({ 
                error: 'このアイテムを更新する権限がありません' 
            });
        }

        const { quantity, is_purchased, memo } = req.body;
        const updateData: any = {};
        
        if (quantity !== undefined) updateData.quantity = quantity;
        if (is_purchased !== undefined) updateData.is_purchased = is_purchased;
        if (memo !== undefined) updateData.memo = memo;

        const updatedItem = await shoppingListRepository.update(itemId, updateData);
        res.status(200).json(updatedItem);
    } catch (error: any) {
        console.error('Update shopping list item error:', error);
        if (error.message === '買い物リストアイテムが見つかりません') {
            return res.status(404).json({ 
                error: error.message 
            });
        }
        res.status(500).json({ error: '買い物リストアイテムの更新中にエラーが発生しました' });
    }
};

/**
 * 買い物リストアイテムを削除
 */
export const deleteShoppingListItemController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                error: '認証が必要です' 
            });
        }

        const { id } = req.params;
        const itemId = parseInt(id, 10);
        
        if (isNaN(itemId)) {
            return res.status(400).json({ 
                error: '無効なアイテムIDです' 
            });
        }

        // アイテムの所有権を確認
        const existingItem = await shoppingListRepository.findById(itemId);
        if (!existingItem) {
            return res.status(404).json({ 
                error: '買い物リストアイテムが見つかりません' 
            });
        }

        if (existingItem.user_id !== userId) {
            return res.status(403).json({ 
                error: 'このアイテムを削除する権限がありません' 
            });
        }

        await shoppingListRepository.delete(itemId);
        res.status(200).json({ 
            message: '買い物リストアイテムが正常に削除されました' 
        });
    } catch (error: any) {
        console.error('Delete shopping list item error:', error);
        if (error.message === '買い物リストアイテムが見つかりません') {
            return res.status(404).json({ 
                error: error.message 
            });
        }
        res.status(500).json({ error: '買い物リストアイテムの削除中にエラーが発生しました' });
    }
};

/**
 * 購入済みアイテムを一括削除
 */
export const deletePurchasedItemsController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                error: '認証が必要です' 
            });
        }

        await shoppingListRepository.deletePurchasedItems(userId);
        res.status(200).json({ 
            message: '購入済みアイテムが正常に削除されました' 
        });
    } catch (error) {
        console.error('Delete purchased items error:', error);
        res.status(500).json({ error: '購入済みアイテムの削除中にエラーが発生しました' });
    }
};

/**
 * レシピから買い物リストを作成
 */
export const createShoppingListFromRecipeController = async (req: AuthRequest, res: Response) => {
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

        const createdItems = await shoppingListRepository.createFromRecipe(userId, recipeId);
        res.status(201).json({
            message: `${createdItems.length}個のアイテムを買い物リストに追加しました`,
            items: createdItems
        });
    } catch (error: any) {
        console.error('Create shopping list from recipe error:', error);
        if (error.message === 'レシピが見つかりません') {
            return res.status(404).json({ 
                error: error.message 
            });
        }
        res.status(500).json({ error: '買い物リストの作成中にエラーが発生しました' });
    }
};
