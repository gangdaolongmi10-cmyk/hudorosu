const db = require('../../models');

export const categoryRepository = {
    /**
     * すべてのカテゴリーを取得する（食材数を含む）
     * 
     * @description カテゴリーをID順で取得し、各カテゴリに紐づく食材数も含める
     * @returns カテゴリーの配列（食材数を含む）
     */
    async findAll() {
        const categories = await db.categories.findAll({
            attributes: ['id', 'name', 'description'],
            order: [['id', 'ASC']]
        });

        // 各カテゴリの食材数を取得
        const categoriesWithFoodCount = await Promise.all(
            categories.map(async (category: any) => {
                const foodCount = await db.foods.count({
                    where: {
                        category_id: category.id,
                        user_id: null // マスタ食材のみ
                    }
                });
                return {
                    ...category.toJSON(),
                    foodCount
                };
            })
        );

        return categoriesWithFoodCount;
    },

    /**
     * カテゴリーの総数を取得する
     * 
     * @description 登録されているカテゴリーの総数を返す
     * @returns カテゴリーの総数
     */
    async count() {
        return await db.categories.count();
    },

    /**
     * IDでカテゴリーを取得する
     * 
     * @param id カテゴリーID
     * @returns カテゴリー情報
     */
    async findById(id: number) {
        return await db.categories.findByPk(id);
    },

    /**
     * カテゴリーを作成する
     * 
     * @param data カテゴリー作成データ
     * @returns 作成されたカテゴリー
     */
    async create(data: { name: string; description?: string | null }) {
        return await db.categories.create(data);
    },

    /**
     * カテゴリーを更新する
     * 
     * @param id カテゴリーID
     * @param data 更新データ
     * @returns 更新されたカテゴリー
     */
    async update(id: number, data: { name?: string; description?: string | null }) {
        const category = await db.categories.findByPk(id);
        if (!category) {
            throw new Error('カテゴリーが見つかりません');
        }
        await category.update(data);
        return category;
    },

    /**
     * カテゴリーを削除する
     * 
     * @param id カテゴリーID
     */
    async delete(id: number) {
        const category = await db.categories.findByPk(id);
        if (!category) {
            throw new Error('カテゴリーが見つかりません');
        }
        await category.destroy();
    }
};
