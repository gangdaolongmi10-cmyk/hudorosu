import { Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
import { stockRepository } from '../../repositories/stockRepository';

/**
 * すべての在庫一覧を取得（管理者用）
 */
export const stocksController = async (req: AuthRequest, res: Response) => {
    try {
        const { user_id, storage_type } = req.query;
        
        const userId = user_id ? parseInt(user_id as string, 10) : undefined;
        const storageType = storage_type as 'refrigerator' | 'freezer' | 'pantry' | undefined;

        if (user_id && isNaN(userId!)) {
            return res.status(400).json({ 
                error: '無効なユーザーIDです' 
            });
        }

        const stocks = await stockRepository.findAll(userId, storageType);
        const totalCount = await stockRepository.count(userId, storageType);

        res.status(200).json({
            stocks,
            totalCount
        });
    } catch (error) {
        console.error('Get stocks error:', error);
        res.status(500).json({ error: '在庫の取得中にエラーが発生しました' });
    }
};

/**
 * 在庫統計情報を取得（管理者用）
 */
export const stocksStatsController = async (req: AuthRequest, res: Response) => {
    try {
        const allStocks = await stockRepository.findAll();
        
        // ユーザー別の在庫数
        const userStockCounts: Record<number, number> = {};
        // 保存タイプ別の在庫数
        const storageTypeCounts = {
            refrigerator: 0,
            freezer: 0,
            pantry: 0
        };
        // 期限切れ・期限間近の在庫数
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const threeDaysLater = new Date(today);
        threeDaysLater.setDate(threeDaysLater.getDate() + 3);
        
        let expiredCount = 0;
        let expiringSoonCount = 0;

        allStocks.forEach((stock: any) => {
            // ユーザー別カウント
            const userId = stock.user_id;
            userStockCounts[userId] = (userStockCounts[userId] || 0) + 1;
            
            // 保存タイプ別カウント
            const storageType = stock.storage_type;
            if (storageType in storageTypeCounts) {
                storageTypeCounts[storageType as keyof typeof storageTypeCounts]++;
            }
            
            // 期限チェック
            const expiryDate = new Date(stock.expiry_date);
            expiryDate.setHours(0, 0, 0, 0);
            
            if (expiryDate < today) {
                expiredCount++;
            } else if (expiryDate <= threeDaysLater) {
                expiringSoonCount++;
            }
        });

        res.status(200).json({
            totalStocks: allStocks.length,
            userStockCounts,
            storageTypeCounts,
            expiredCount,
            expiringSoonCount
        });
    } catch (error) {
        console.error('Get stocks stats error:', error);
        res.status(500).json({ error: '在庫統計情報の取得中にエラーが発生しました' });
    }
};

