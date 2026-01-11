const db = require('../../models');

export const allergenRepository = {
    /**
     * すべてのアレルゲンを取得する
     * 
     * @description アレルゲンをID順で取得する
     * @returns アレルゲンの配列
     */
    async findAll() {
        return await db.allergens.findAll({
            attributes: ['id', 'name'],
            order: [['id', 'ASC']]
        });
    },

    /**
     * IDでアレルゲンを取得する
     * 
     * @param id アレルゲンID
     * @returns アレルゲン情報
     */
    async findById(id: number) {
        return await db.allergens.findByPk(id);
    },

    /**
     * アレルゲンの総数を取得する
     * 
     * @description 登録されているアレルゲンの総数を返す
     * @returns アレルゲンの総数
     */
    async count() {
        return await db.allergens.count();
    },

    /**
     * アレルゲンを作成する
     * 
     * @param data アレルゲン作成データ
     * @returns 作成されたアレルゲン
     */
    async create(data: { name: string }) {
        return await db.allergens.create(data);
    },

    /**
     * アレルゲンを更新する
     * 
     * @param id アレルゲンID
     * @param data 更新データ
     * @returns 更新されたアレルゲン
     */
    async update(id: number, data: { name?: string }) {
        const allergen = await db.allergens.findByPk(id);
        if (!allergen) {
            throw new Error('アレルゲンが見つかりません');
        }
        await allergen.update(data);
        return allergen;
    },

    /**
     * アレルゲンを削除する
     * 
     * @param id アレルゲンID
     */
    async delete(id: number) {
        const allergen = await db.allergens.findByPk(id);
        if (!allergen) {
            throw new Error('アレルゲンが見つかりません');
        }
        await allergen.destroy();
    }
};

