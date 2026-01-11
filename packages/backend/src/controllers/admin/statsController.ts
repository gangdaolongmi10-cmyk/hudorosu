import { Request, Response } from 'express';
import { categoryRepository } from '../../repositories/categoryRepository';
import { foodRepository } from '../../repositories/foodRepository';
import { userRepository } from '../../repositories/userRepository';

export const statsController = async (req: Request, res: Response) => {
    try {
        const [totalCategories, totalFoods, totalUsers] = await Promise.all([
            categoryRepository.count(),
            foodRepository.countMasterFoods(),
            userRepository.countUsers()
        ]);

        res.status(200).json({
            totalCategories,
            totalFoods,
            totalUsers
        });
    } catch (error) {
        console.error('Stats Fetch Error:', error);
        res.status(500).json({ error: '統計情報の取得中にエラーが発生しました' });
    }
};

