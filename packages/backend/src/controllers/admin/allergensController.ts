import { Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
import { allergenRepository } from '../../repositories/allergenRepository';

/**
 * アレルゲン一覧を取得
 */
export const allergensController = async (req: AuthRequest, res: Response) => {
    try {
        const allergens = await allergenRepository.findAll();
        res.status(200).json(allergens);
    } catch (error) {
        console.error('Allergen Fetch Error:', error);
        res.status(500).json({ error: 'アレルゲンの取得中にエラーが発生しました' });
    }
};

/**
 * アレルゲンを作成
 */
export const createAllergenController = async (req: AuthRequest, res: Response) => {
    try {
        const { name } = req.body;

        // バリデーション
        if (!name || name.trim() === '') {
            return res.status(400).json({ 
                error: 'アレルゲン名を入力してください' 
            });
        }

        // アレルゲン名の重複チェック
        const db = require('../../../models');
        const existingAllergen = await db.allergens.findOne({
            where: { name: name.trim() }
        });
        
        if (existingAllergen) {
            return res.status(400).json({ 
                error: 'このアレルゲン名は既に使用されています' 
            });
        }

        const allergen = await allergenRepository.create({
            name: name.trim(),
        });

        res.status(201).json({
            id: allergen.id,
            name: allergen.name,
        });
    } catch (error: any) {
        console.error('Create allergen error:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ 
                error: 'このアレルゲン名は既に使用されています' 
            });
        }
        res.status(500).json({ 
            error: 'アレルゲンの作成中にエラーが発生しました' 
        });
    }
};

/**
 * アレルゲンを更新
 */
export const updateAllergenController = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        // バリデーション
        if (!id) {
            return res.status(400).json({ 
                error: 'アレルゲンIDが必要です' 
            });
        }

        const allergenId = parseInt(id, 10);
        if (isNaN(allergenId)) {
            return res.status(400).json({ 
                error: '無効なアレルゲンIDです' 
            });
        }

        if (!name || name.trim() === '') {
            return res.status(400).json({ 
                error: 'アレルゲン名を入力してください' 
            });
        }

        // アレルゲンの存在確認
        const existingAllergen = await allergenRepository.findById(allergenId);
        if (!existingAllergen) {
            return res.status(404).json({ 
                error: 'アレルゲンが見つかりません' 
            });
        }

        // アレルゲン名の重複チェック（自分自身を除く）
        const db = require('../../../models');
        const duplicateAllergen = await db.allergens.findOne({
            where: { 
                name: name.trim(),
                id: { [db.Sequelize.Op.ne]: allergenId }
            }
        });
        if (duplicateAllergen) {
            return res.status(400).json({ 
                error: 'このアレルゲン名は既に使用されています' 
            });
        }

        const updatedAllergen = await allergenRepository.update(allergenId, {
            name: name.trim(),
        });

        res.status(200).json({
            id: updatedAllergen.id,
            name: updatedAllergen.name,
        });
    } catch (error: any) {
        console.error('Update allergen error:', error);
        if (error.message === 'アレルゲンが見つかりません') {
            return res.status(404).json({ 
                error: error.message 
            });
        }
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ 
                error: 'このアレルゲン名は既に使用されています' 
            });
        }
        res.status(500).json({ 
            error: 'アレルゲンの更新中にエラーが発生しました' 
        });
    }
};

/**
 * アレルゲンを削除
 */
export const deleteAllergenController = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        // バリデーション
        if (!id) {
            return res.status(400).json({ 
                error: 'アレルゲンIDが必要です' 
            });
        }

        const allergenId = parseInt(id, 10);
        if (isNaN(allergenId)) {
            return res.status(400).json({ 
                error: '無効なアレルゲンIDです' 
            });
        }

        // アレルゲンの存在確認
        const existingAllergen = await allergenRepository.findById(allergenId);
        if (!existingAllergen) {
            return res.status(404).json({ 
                error: 'アレルゲンが見つかりません' 
            });
        }

        await allergenRepository.delete(allergenId);

        res.status(200).json({ 
            message: 'アレルゲンが正常に削除されました' 
        });
    } catch (error: any) {
        console.error('Delete allergen error:', error);
        if (error.message === 'アレルゲンが見つかりません') {
            return res.status(404).json({ 
                error: error.message 
            });
        }
        res.status(500).json({ 
            error: 'アレルゲンの削除中にエラーが発生しました' 
        });
    }
};

