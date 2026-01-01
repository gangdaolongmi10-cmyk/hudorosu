const db = require('../../models');
import { ROLE } from '../constants/role';

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
    },

    /**
     * 一般ユーザーの数を取得する（管理者を除く）
     * 
     * @description ロールが'user'のユーザーのみをカウントする
     * @returns 一般ユーザーの数
     */
    async countUsers() {
        return await db.users.count({
            where: {
                role: ROLE.USER
            }
        });
    }
};

