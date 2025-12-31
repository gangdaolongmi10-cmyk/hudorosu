const db = require('../../models');

export const categoryRepository = {
    /**
     * すべてのカテゴリーを取得する
     * 
     * @description カテゴリーをID順で取得する
     * @returns 
     */
    async findAll() {
        return await db.categories.findAll({
            attributes: ['id', 'name', 'description'],
            order: [['id', 'ASC']]
        });
    }
};
