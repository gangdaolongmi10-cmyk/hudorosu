import { Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
import { faqRepository } from '../../repositories/faqRepository';

/**
 * FAQ一覧を取得（ユーザー向け）
 */
export const getFaqsController = async (req: AuthRequest, res: Response) => {
    try {
        const faqs = await faqRepository.findAll();
        res.status(200).json(faqs);
    } catch (error) {
        console.error('FAQ Fetch Error:', error);
        res.status(500).json({ error: 'FAQの取得中にエラーが発生しました' });
    }
};

