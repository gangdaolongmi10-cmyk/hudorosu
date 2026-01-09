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
    },

    /**
     * ユーザーIDでユーザーを取得する
     * 
     * @param userId ユーザーID
     * @returns ユーザー情報
     */
    async findById(userId: number) {
        return await db.users.findByPk(userId, {
            attributes: ['id', 'email', 'name', 'role', 'avatar_url', 'daily_food_budget', 'created_at', 'updated_at']
        });
    },

    /**
     * ユーザーの目標食費を更新する
     * 
     * @param userId ユーザーID
     * @param dailyFoodBudget 1日の目標食費（円）
     * @returns 更新されたユーザー情報
     */
    async updateDailyFoodBudget(userId: number, dailyFoodBudget: number | null) {
        const user = await db.users.findByPk(userId);
        if (!user) {
            throw new Error('ユーザーが見つかりません');
        }

        console.log('Updating user daily_food_budget:', userId, 'to:', dailyFoodBudget);
        await user.update({ daily_food_budget: dailyFoodBudget });
        console.log('User updated, fetching updated user...');
        const updatedUser = await this.findById(userId);
        console.log('Updated user daily_food_budget:', updatedUser.daily_food_budget);
        return updatedUser;
    }
};

