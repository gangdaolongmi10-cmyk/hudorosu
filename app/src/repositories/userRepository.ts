const db = require('../../models');

export const userRepository = {
    /**
     * すべてのユーザーを取得する
     * 
     * @description ユーザーをID順で取得する
     * @returns ユーザーの配列
     */
    async findAll() {
        return await db.users.findAll({
            attributes: ['id', 'email', 'name', 'role', 'avatar_url', 'created_at', 'updated_at'],
            order: [['id', 'ASC']]
        });
    }
};

