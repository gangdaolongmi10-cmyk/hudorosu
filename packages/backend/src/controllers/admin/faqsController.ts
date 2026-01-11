import { Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
import { faqRepository } from '../../repositories/faqRepository';

/**
 * FAQ一覧を取得
 */
export const faqsController = async (req: AuthRequest, res: Response) => {
    try {
        const faqs = await faqRepository.findAll();
        res.status(200).json(faqs);
    } catch (error) {
        console.error('FAQ Fetch Error:', error);
        res.status(500).json({ error: 'FAQの取得中にエラーが発生しました' });
    }
};

/**
 * FAQを作成
 */
export const createFaqController = async (req: AuthRequest, res: Response) => {
    try {
        const { question, answer, order } = req.body;

        // バリデーション
        if (!question || question.trim() === '') {
            return res.status(400).json({ 
                error: '質問を入力してください' 
            });
        }

        if (!answer || answer.trim() === '') {
            return res.status(400).json({ 
                error: '回答を入力してください' 
            });
        }

        const faq = await faqRepository.create({
            question: question.trim(),
            answer: answer.trim(),
            order: order !== undefined ? parseInt(order, 10) : 0,
        });

        res.status(201).json({
            id: faq.id,
            question: faq.question,
            answer: faq.answer,
            order: faq.order,
        });
    } catch (error: any) {
        console.error('Create FAQ error:', error);
        res.status(500).json({ 
            error: 'FAQの作成中にエラーが発生しました' 
        });
    }
};

/**
 * FAQを更新
 */
export const updateFaqController = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { question, answer, order } = req.body;

        // バリデーション
        if (!id) {
            return res.status(400).json({ 
                error: 'FAQ IDが必要です' 
            });
        }

        const faqId = parseInt(id, 10);
        if (isNaN(faqId)) {
            return res.status(400).json({ 
                error: '無効なFAQ IDです' 
            });
        }

        // FAQの存在確認
        const existingFaq = await faqRepository.findById(faqId);
        if (!existingFaq) {
            return res.status(404).json({ 
                error: 'FAQが見つかりません' 
            });
        }

        // 更新データの準備
        const updateData: { question?: string; answer?: string; order?: number } = {};
        if (question !== undefined) {
            if (question.trim() === '') {
                return res.status(400).json({ 
                    error: '質問を入力してください' 
                });
            }
            updateData.question = question.trim();
        }
        if (answer !== undefined) {
            if (answer.trim() === '') {
                return res.status(400).json({ 
                    error: '回答を入力してください' 
                });
            }
            updateData.answer = answer.trim();
        }
        if (order !== undefined) {
            updateData.order = parseInt(order, 10);
        }

        const updatedFaq = await faqRepository.update(faqId, updateData);

        res.status(200).json({
            id: updatedFaq.id,
            question: updatedFaq.question,
            answer: updatedFaq.answer,
            order: updatedFaq.order,
        });
    } catch (error: any) {
        console.error('Update FAQ error:', error);
        if (error.message === 'FAQが見つかりません') {
            return res.status(404).json({ 
                error: error.message 
            });
        }
        res.status(500).json({ 
            error: 'FAQの更新中にエラーが発生しました' 
        });
    }
};

/**
 * FAQを削除
 */
export const deleteFaqController = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        // バリデーション
        if (!id) {
            return res.status(400).json({ 
                error: 'FAQ IDが必要です' 
            });
        }

        const faqId = parseInt(id, 10);
        if (isNaN(faqId)) {
            return res.status(400).json({ 
                error: '無効なFAQ IDです' 
            });
        }

        // FAQの存在確認
        const existingFaq = await faqRepository.findById(faqId);
        if (!existingFaq) {
            return res.status(404).json({ 
                error: 'FAQが見つかりません' 
            });
        }

        await faqRepository.delete(faqId);

        res.status(200).json({ 
            message: 'FAQが正常に削除されました' 
        });
    } catch (error: any) {
        console.error('Delete FAQ error:', error);
        if (error.message === 'FAQが見つかりません') {
            return res.status(404).json({ 
                error: error.message 
            });
        }
        res.status(500).json({ 
            error: 'FAQの削除中にエラーが発生しました' 
        });
    }
};

