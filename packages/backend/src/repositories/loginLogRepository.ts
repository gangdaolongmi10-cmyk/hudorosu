const db = require('../../models');

export const loginLogRepository = {
    /**
     * すべてのログインログを取得する
     * 
     * @description ログインログを日時順（新しい順）で取得し、ユーザー情報も含める
     * @param limit 取得件数の上限（オプション）
     * @param offset オフセット（オプション）
     * @returns ログインログの配列
     */
    async findAll(limit?: number, offset?: number) {
        const options: any = {
            include: [
                {
                    model: db.users,
                    as: 'user',
                    attributes: ['id', 'email', 'name', 'role'],
                    required: false
                }
            ],
            attributes: ['id', 'user_id', 'login_method', 'ip_address', 'created_at'],
            order: [['created_at', 'DESC']]
        };

        if (limit !== undefined) {
            options.limit = limit;
        }
        if (offset !== undefined) {
            options.offset = offset;
        }

        return await db.login_logs.findAll(options);
    },

    /**
     * ログインログの総数を取得する
     * 
     * @description 登録されているログインログの総数を返す
     * @returns ログインログの総数
     */
    async count() {
        return await db.login_logs.count();
    },

    /**
     * ユーザーIDでログインログを取得する
     * 
     * @param userId ユーザーID
     * @param limit 取得件数の上限（オプション）
     * @param offset オフセット（オプション）
     * @returns ログインログの配列
     */
    async findByUserId(userId: number, limit?: number, offset?: number) {
        const options: any = {
            where: {
                user_id: userId
            },
            include: [
                {
                    model: db.users,
                    as: 'user',
                    attributes: ['id', 'email', 'name', 'role'],
                    required: false
                }
            ],
            attributes: ['id', 'user_id', 'login_method', 'ip_address', 'created_at'],
            order: [['created_at', 'DESC']]
        };

        if (limit !== undefined) {
            options.limit = limit;
        }
        if (offset !== undefined) {
            options.offset = offset;
        }

        return await db.login_logs.findAll(options);
    }
};

