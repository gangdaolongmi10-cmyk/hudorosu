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
    },

    /**
     * カテゴリーの総数を取得する
     * 
     * @description 登録されているカテゴリーの総数を返す
     * @returns カテゴリーの総数
     */
    async count() {
        return await db.categories.count();
    }
};
