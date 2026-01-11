import { Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
import { loginLogRepository } from '../../repositories/loginLogRepository';

/**
 * ログインログ一覧を取得
 */
export const loginLogsController = async (req: AuthRequest, res: Response) => {
    try {
        const { limit, offset, user_id } = req.query;

        let logs;
        let totalCount;

        if (user_id) {
            const userId = parseInt(user_id as string, 10);
            if (isNaN(userId)) {
                return res.status(400).json({ 
                    error: '無効なユーザーIDです' 
                });
            }

            const limitNum = limit ? parseInt(limit as string, 10) : undefined;
            const offsetNum = offset ? parseInt(offset as string, 10) : undefined;

            logs = await loginLogRepository.findByUserId(userId, limitNum, offsetNum);
            totalCount = await loginLogRepository.count();
        } else {
            const limitNum = limit ? parseInt(limit as string, 10) : 100; // デフォルト100件
            const offsetNum = offset ? parseInt(offset as string, 10) : 0;

            logs = await loginLogRepository.findAll(limitNum, offsetNum);
            totalCount = await loginLogRepository.count();
        }

        res.status(200).json({
            logs,
            totalCount,
            limit: limit ? parseInt(limit as string, 10) : 100,
            offset: offset ? parseInt(offset as string, 10) : 0
        });
    } catch (error) {
        console.error('Login Log Fetch Error:', error);
        res.status(500).json({ error: 'ログインログの取得中にエラーが発生しました' });
    }
};
