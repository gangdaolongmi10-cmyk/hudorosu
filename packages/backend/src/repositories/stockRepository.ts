const db = require('../../models');

export interface CreateStockData {
    user_id: number;
    food_id: number;
    expiry_date: string;
    storage_type: 'refrigerator' | 'freezer' | 'pantry';
    quantity?: string | null;
    memo?: string | null;
}

export interface UpdateStockData {
    food_id?: number;
    expiry_date?: string;
    storage_type?: 'refrigerator' | 'freezer' | 'pantry';
    quantity?: string | null;
    memo?: string | null;
}

export const stockRepository = {
    /**
     * ユーザーの在庫一覧を取得する
     * 
     * @param userId ユーザーID
     * @param storageType 保存タイプ（オプション）
     * @returns 在庫の配列
     */
    async findByUserId(userId: number, storageType?: 'refrigerator' | 'freezer' | 'pantry') {
        const where: any = {
            user_id: userId
        };
        
        if (storageType) {
            where.storage_type = storageType;
        }

        return await db.stocks.findAll({
            where,
            include: [
                {
                    model: db.foods,
                    as: 'food',
                    attributes: ['id', 'name', 'category_id'],
                    include: [
                        {
                            model: db.categories,
                            as: 'category',
                            attributes: ['id', 'name', 'description']
                        }
                    ]
                }
            ],
            attributes: ['id', 'user_id', 'food_id', 'expiry_date', 'storage_type', 'quantity', 'memo', 'created_at', 'updated_at'],
            order: [['expiry_date', 'ASC']]
        });
    },

    /**
     * IDで在庫を取得する
     * 
     * @param id 在庫ID
     * @param userId ユーザーID（オプション、セキュリティチェック用）
     * @returns 在庫情報
     */
    async findById(id: number, userId?: number) {
        const where: any = { id };
        
        if (userId) {
            where.user_id = userId;
        }

        return await db.stocks.findOne({
            where,
            include: [
                {
                    model: db.foods,
                    as: 'food',
                    attributes: ['id', 'name', 'category_id'],
                    include: [
                        {
                            model: db.categories,
                            as: 'category',
                            attributes: ['id', 'name', 'description']
                        }
                    ]
                }
            ],
            attributes: ['id', 'user_id', 'food_id', 'expiry_date', 'storage_type', 'quantity', 'memo', 'created_at', 'updated_at']
        });
    },

    /**
     * 在庫を作成する
     * 
     * @param data 在庫作成データ
     * @returns 作成された在庫
     */
    async create(data: CreateStockData) {
        const stock = await db.stocks.create({
            user_id: data.user_id,
            food_id: data.food_id,
            expiry_date: data.expiry_date,
            storage_type: data.storage_type,
            quantity: data.quantity || null,
            memo: data.memo || null,
        });

        // 作成された在庫を再取得（関連情報を含む）
        return await this.findById(stock.id);
    },

    /**
     * 在庫を更新する
     * 
     * @param id 在庫ID
     * @param userId ユーザーID
     * @param data 更新データ
     * @returns 更新された在庫
     */
    async update(id: number, userId: number, data: UpdateStockData) {
        const stock = await db.stocks.findOne({
            where: {
                id,
                user_id: userId
            }
        });

        if (!stock) {
            throw new Error('在庫が見つかりません');
        }

        const updateData: any = {};
        if (data.food_id !== undefined) updateData.food_id = data.food_id;
        if (data.expiry_date !== undefined) updateData.expiry_date = data.expiry_date;
        if (data.storage_type !== undefined) updateData.storage_type = data.storage_type;
        if (data.quantity !== undefined) updateData.quantity = data.quantity;
        if (data.memo !== undefined) updateData.memo = data.memo;

        await stock.update(updateData);

        // 更新された在庫を再取得（関連情報を含む）
        return await this.findById(id);
    },

    /**
     * 在庫を削除する
     * 
     * @param id 在庫ID
     * @param userId ユーザーID
     */
    async delete(id: number, userId: number) {
        const stock = await db.stocks.findOne({
            where: {
                id,
                user_id: userId
            }
        });

        if (!stock) {
            throw new Error('在庫が見つかりません');
        }

        await stock.destroy();
    },

    /**
     * すべての在庫を取得する（管理者用）
     * 
     * @param userId ユーザーID（オプション、フィルタリング用）
     * @param storageType 保存タイプ（オプション）
     * @returns 在庫の配列
     */
    async findAll(userId?: number, storageType?: 'refrigerator' | 'freezer' | 'pantry') {
        const where: any = {};
        
        if (userId) {
            where.user_id = userId;
        }
        
        if (storageType) {
            where.storage_type = storageType;
        }

        return await db.stocks.findAll({
            where,
            include: [
                {
                    model: db.users,
                    as: 'user',
                    attributes: ['id', 'email', 'name', 'role'],
                    required: true
                },
                {
                    model: db.foods,
                    as: 'food',
                    attributes: ['id', 'name', 'category_id'],
                    include: [
                        {
                            model: db.categories,
                            as: 'category',
                            attributes: ['id', 'name', 'description']
                        }
                    ]
                }
            ],
            attributes: ['id', 'user_id', 'food_id', 'expiry_date', 'storage_type', 'quantity', 'memo', 'created_at', 'updated_at'],
            order: [['expiry_date', 'ASC']]
        });
    },

    /**
     * 在庫の総数を取得する（管理者用）
     * 
     * @param userId ユーザーID（オプション、フィルタリング用）
     * @param storageType 保存タイプ（オプション）
     * @returns 在庫の総数
     */
    async count(userId?: number, storageType?: 'refrigerator' | 'freezer' | 'pantry') {
        const where: any = {};
        
        if (userId) {
            where.user_id = userId;
        }
        
        if (storageType) {
            where.storage_type = storageType;
        }

        return await db.stocks.count({ where });
    }
};

