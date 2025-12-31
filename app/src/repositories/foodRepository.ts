const db = require('../../models');

export const foodRepository = {
    /**
     * マスタ食材（user_idがnull）をすべて取得する
     * 
     * @description マスタ食材をID順で取得し、カテゴリとアレルギー情報も含める
     * @returns マスタ食材の配列
     */
    async findAllMasterFoods() {
        return await db.foods.findAll({
            where: {
                user_id: null
            },
            include: [
                {
                    model: db.categories,
                    as: 'category',
                    attributes: ['id', 'name', 'description']
                },
                {
                    model: db.allergens,
                    as: 'allergen_id_allergens',
                    attributes: ['id', 'name'],
                    through: {
                        attributes: []
                    }
                }
            ],
            attributes: ['id', 'name', 'category_id', 'user_id', 'best_before_date', 'expiry_date', 'memo', 'created_at', 'updated_at'],
            order: [['id', 'ASC']]
        });
    }
};

