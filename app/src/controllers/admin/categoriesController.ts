import { Request, Response } from 'express';
import { categoryRepository } from '../../repositories/categoryRepository';

export const categoriesController = async (req: Request, res: Response) => {
    try {
        const categories = await categoryRepository.findAll();
        res.status(200).json(categories);
    } catch (error) {
        console.error('Category Fetch Error:', error);
        res.status(500).json({ error: 'カテゴリーの取得中にエラーが発生しました' });
    }
};