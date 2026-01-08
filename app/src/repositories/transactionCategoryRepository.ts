const db = require('../../models');
const { Op } = require('sequelize');

export interface CreateTransactionCategoryData {
    user_id: number | null;
    name: string;
    description?: string | null;
    color?: string;
}

export interface UpdateTransactionCategoryData {
    name?: string;
    description?: string | null;
    color?: string;
}

export const transactionCategoryRepository = {
    /**
     * ユーザーのカテゴリ一覧を取得する
     * 
     * @param userId ユーザーID（nullの場合は全ユーザー共通のカテゴリ）
     * @returns カテゴリの配列
     */
    async findByUserId(userId: number | null) {
        const where: any = {};
        
        // user_idがnullの場合は全ユーザー共通、それ以外はそのユーザーのカテゴリ
        if (userId === null) {
            where.user_id = null;
        } else {
            where[Op.or] = [
                { user_id: userId },
                { user_id: null } // 全ユーザー共通のカテゴリも含める
            ];
        }

        return await db.transaction_categories.findAll({
            where,
            attributes: ['id', 'user_id', 'name', 'description', 'color', 'created_at', 'updated_at'],
            order: [['name', 'ASC']]
        });
    },

    /**
     * IDでカテゴリを取得する
     * 
     * @param id カテゴリID
     * @param userId ユーザーID（オプション、セキュリティチェック用）
     * @returns カテゴリ情報
     */
    async findById(id: number, userId?: number | null) {
        const where: any = { id };
        
        if (userId !== undefined) {
            where[Op.or] = [
                { user_id: userId },
                { user_id: null } // 全ユーザー共通のカテゴリも含める
            ];
        }

        return await db.transaction_categories.findOne({
            where,
            attributes: ['id', 'user_id', 'name', 'description', 'color', 'created_at', 'updated_at']
        });
    },

    /**
     * カテゴリを作成する
     * 
     * @param data カテゴリ作成データ
     * @returns 作成されたカテゴリ
     */
    async create(data: CreateTransactionCategoryData) {
        return await db.transaction_categories.create({
            user_id: data.user_id,
            name: data.name,
            description: data.description || null,
            color: data.color || '#3B82F6',
        });
    },

    /**
     * カテゴリを更新する
     * 
     * @param id カテゴリID
     * @param userId ユーザーID
     * @param data 更新データ
     * @returns 更新されたカテゴリ
     */
    async update(id: number, userId: number | null, data: UpdateTransactionCategoryData) {
        const category = await db.transaction_categories.findOne({
            where: {
                id,
                [Op.or]: [
                    { user_id: userId },
                    { user_id: null } // 全ユーザー共通のカテゴリも更新可能
                ]
            }
        });

        if (!category) {
            throw new Error('カテゴリが見つかりません');
        }

        const updateData: any = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.color !== undefined) updateData.color = data.color;

        await category.update(updateData);
        return category;
    },

    /**
     * カテゴリを削除する
     * 
     * @param id カテゴリID
     * @param userId ユーザーID
     */
    async delete(id: number, userId: number | null) {
        const category = await db.transaction_categories.findOne({
            where: {
                id,
                [Op.or]: [
                    { user_id: userId },
                    { user_id: null } // 全ユーザー共通のカテゴリも削除可能
                ]
            }
        });

        if (!category) {
            throw new Error('カテゴリが見つかりません');
        }

        await category.destroy();
    }
};

