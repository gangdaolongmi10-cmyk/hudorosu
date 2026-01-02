import { Request, Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
import { stockRepository } from '../../repositories/stockRepository';
import { foodRepository } from '../../repositories/foodRepository';

/**
 * ユーザーの在庫一覧を取得
 */
export const getStocksController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                error: '認証が必要です' 
            });
        }

        const { storage_type } = req.query;
        const storageType = storage_type as 'refrigerator' | 'freezer' | 'pantry' | undefined;

        const stocks = await stockRepository.findByUserId(userId, storageType);
        res.status(200).json(stocks);
    } catch (error) {
        console.error('Get stocks error:', error);
        res.status(500).json({ error: '在庫の取得中にエラーが発生しました' });
    }
};

/**
 * 在庫を取得（ID指定）
 */
export const getStockByIdController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                error: '認証が必要です' 
            });
        }

        const { id } = req.params;
        const stockId = parseInt(id, 10);
        
        if (isNaN(stockId)) {
            return res.status(400).json({ 
                error: '無効な在庫IDです' 
            });
        }

        const stock = await stockRepository.findById(stockId, userId);
        
        if (!stock) {
            return res.status(404).json({ 
                error: '在庫が見つかりません' 
            });
        }

        res.status(200).json(stock);
    } catch (error) {
        console.error('Get stock by id error:', error);
        res.status(500).json({ error: '在庫の取得中にエラーが発生しました' });
    }
};

/**
 * 在庫を作成
 */
export const createStockController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                error: '認証が必要です' 
            });
        }

        const { food_id, expiry_date, storage_type, quantity, memo } = req.body;

        // バリデーション
        if (!food_id) {
            return res.status(400).json({ 
                error: '食材IDを指定してください' 
            });
        }

        if (!expiry_date) {
            return res.status(400).json({ 
                error: '期限日を指定してください' 
            });
        }

        if (!storage_type || !['refrigerator', 'freezer', 'pantry'].includes(storage_type)) {
            return res.status(400).json({ 
                error: '保存タイプを指定してください（refrigerator, freezer, pantry）' 
            });
        }

        const foodId = parseInt(food_id, 10);
        if (isNaN(foodId)) {
            return res.status(400).json({ 
                error: '無効な食材IDです' 
            });
        }

        // 食材の存在確認
        const food = await foodRepository.findById(foodId);
        if (!food) {
            return res.status(404).json({ 
                error: '食材が見つかりません',
                foodId: foodId
            });
        }

        // 在庫を作成
        const stock = await stockRepository.create({
            user_id: userId,
            food_id: foodId,
            expiry_date: expiry_date,
            storage_type: storage_type,
            quantity: quantity || null,
            memo: memo || null,
        });

        res.status(201).json(stock);
    } catch (error: any) {
        console.error('Create stock error:', error);
        
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
            error: error.message || '在庫の作成中にエラーが発生しました' 
        });
    }
};

/**
 * 在庫を更新
 */
export const updateStockController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                error: '認証が必要です' 
            });
        }

        const { id } = req.params;
        const stockId = parseInt(id, 10);
        
        if (isNaN(stockId)) {
            return res.status(400).json({ 
                error: '無効な在庫IDです' 
            });
        }

        const { food_id, expiry_date, storage_type, quantity, memo } = req.body;

        // バリデーション
        if (storage_type && !['refrigerator', 'freezer', 'pantry'].includes(storage_type)) {
            return res.status(400).json({ 
                error: '無効な保存タイプです（refrigerator, freezer, pantry）' 
            });
        }

        const updateData: any = {};
        if (food_id !== undefined) {
            const foodId = parseInt(food_id, 10);
            if (isNaN(foodId)) {
                return res.status(400).json({ 
                    error: '無効な食材IDです' 
                });
            }
            
            // 食材の存在確認
            const food = await foodRepository.findById(foodId);
            if (!food) {
                return res.status(404).json({ 
                    error: '食材が見つかりません' 
                });
            }
            
            updateData.food_id = foodId;
        }
        if (expiry_date !== undefined) updateData.expiry_date = expiry_date;
        if (storage_type !== undefined) updateData.storage_type = storage_type;
        if (quantity !== undefined) updateData.quantity = quantity;
        if (memo !== undefined) updateData.memo = memo;

        const stock = await stockRepository.update(stockId, userId, updateData);
        res.status(200).json(stock);
    } catch (error: any) {
        console.error('Update stock error:', error);
        
        if (error.message === '在庫が見つかりません') {
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
            error: error.message || '在庫の更新中にエラーが発生しました' 
        });
    }
};

/**
 * 在庫を削除
 */
export const deleteStockController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                error: '認証が必要です' 
            });
        }

        const { id } = req.params;
        const stockId = parseInt(id, 10);
        
        if (isNaN(stockId)) {
            return res.status(400).json({ 
                error: '無効な在庫IDです' 
            });
        }

        await stockRepository.delete(stockId, userId);
        res.status(204).send();
    } catch (error: any) {
        console.error('Delete stock error:', error);
        
        if (error.message === '在庫が見つかりません') {
            return res.status(404).json({ 
                error: error.message 
            });
        }
        
        res.status(500).json({ 
            error: error.message || '在庫の削除中にエラーが発生しました' 
        });
    }
};

