import { Request, Response } from 'express';
import { foodRepository } from '../../repositories/foodRepository';

export const foodsController = async (req: Request, res: Response) => {
    try {
        const foods = await foodRepository.findAllMasterFoods();
        res.status(200).json(foods);
    } catch (error) {
        console.error('Food Fetch Error:', error);
        res.status(500).json({ error: '食材の取得中にエラーが発生しました' });
    }
};

