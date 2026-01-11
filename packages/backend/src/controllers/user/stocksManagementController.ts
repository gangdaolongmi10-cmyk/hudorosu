import { Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
import { stockRepository } from '../../repositories/stockRepository';

/**
 * 一般ユーザーの在庫一覧を取得（自分の在庫のみ）
 */
export const getUserStocksController = async (req: AuthRequest, res: Response) => {
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
        const totalCount = await stockRepository.count(userId, storageType);

        res.status(200).json({
            stocks,
            totalCount
        });
    } catch (error) {
        console.error('Get user stocks error:', error);
        res.status(500).json({ error: '在庫の取得中にエラーが発生しました' });
    }
};

