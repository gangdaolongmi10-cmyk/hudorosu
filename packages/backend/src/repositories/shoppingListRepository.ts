const db = require('../../models');

export interface CreateShoppingListItemData {
    food_id: number;
    quantity?: string | null;
    memo?: string | null;
}

export interface UpdateShoppingListItemData {
    quantity?: string | null;
    is_purchased?: boolean;
    memo?: string | null;
}

export const shoppingListRepository = {
    /**
     * ユーザーの買い物リストを取得する
     * 
     * @param userId ユーザーID
     * @param includePurchased 購入済みアイテムを含めるかどうか
     * @returns 買い物リストの配列
     */
    async findByUserId(userId: number, includePurchased: boolean = true) {
        const where: any = { user_id: userId };
        if (!includePurchased) {
            where.is_purchased = false;
        }

        return await db.shopping_lists.findAll({
            where,
            include: [
                {
                    model: db.foods,
                    as: 'food',
                    attributes: ['id', 'name', 'category_id', 'price'],
                    include: [
                        {
                            model: db.categories,
                            as: 'category',
                            attributes: ['id', 'name']
                        }
                    ]
                }
            ],
            order: [
                ['is_purchased', 'ASC'],
                ['created_at', 'DESC']
            ]
        });
    },

    /**
     * IDで買い物リストアイテムを取得する
     * 
     * @param id 買い物リストID
     * @returns 買い物リストアイテム
     */
    async findById(id: number) {
        return await db.shopping_lists.findOne({
            where: { id },
            include: [
                {
                    model: db.foods,
                    as: 'food',
                    attributes: ['id', 'name', 'category_id', 'price'],
                    include: [
                        {
                            model: db.categories,
                            as: 'category',
                            attributes: ['id', 'name']
                        }
                    ]
                }
            ]
        });
    },

    /**
     * 買い物リストアイテムを作成する
     * 
     * @param userId ユーザーID
     * @param data 作成データ
     * @returns 作成された買い物リストアイテム
     */
    async create(userId: number, data: CreateShoppingListItemData) {
        return await db.shopping_lists.create({
            user_id: userId,
            food_id: data.food_id,
            quantity: data.quantity || null,
            memo: data.memo || null,
            is_purchased: false
        });
    },

    /**
     * 買い物リストアイテムを更新する
     * 
     * @param id 買い物リストID
     * @param data 更新データ
     * @returns 更新された買い物リストアイテム
     */
    async update(id: number, data: UpdateShoppingListItemData) {
        const item = await db.shopping_lists.findOne({ where: { id } });
        if (!item) {
            throw new Error('買い物リストアイテムが見つかりません');
        }

        await item.update(data);
        return await this.findById(id);
    },

    /**
     * 買い物リストアイテムを削除する
     * 
     * @param id 買い物リストID
     */
    async delete(id: number) {
        const item = await db.shopping_lists.findOne({ where: { id } });
        if (!item) {
            throw new Error('買い物リストアイテムが見つかりません');
        }

        await item.destroy();
    },

    /**
     * 購入済みアイテムを一括削除する
     * 
     * @param userId ユーザーID
     */
    async deletePurchasedItems(userId: number) {
        await db.shopping_lists.destroy({
            where: {
                user_id: userId,
                is_purchased: true
            }
        });
    },

    /**
     * レシピから買い物リストを作成する
     * 在庫にない食材のみを買い物リストに追加する
     * 
     * @param userId ユーザーID
     * @param recipeId レシピID
     * @returns 作成された買い物リストアイテムの配列
     */
    async createFromRecipe(userId: number, recipeId: number) {
        // レシピを取得
        const recipe = await db.recipes.findOne({
            where: { id: recipeId },
            include: [
                {
                    model: db.foods,
                    as: 'food_id_foods',
                    attributes: ['id', 'name'],
                    through: {
                        attributes: ['quantity']
                    }
                }
            ]
        });

        if (!recipe) {
            throw new Error('レシピが見つかりません');
        }

        // ユーザーの在庫を取得
        const stocks = await db.stocks.findAll({
            where: { user_id: userId },
            attributes: ['food_id']
        });

        const stockFoodIds = stocks.map((stock: any) => stock.food_id);

        // 在庫にない食材を買い物リストに追加
        const createdItems = [];
        const recipeFoods = recipe.food_id_foods || [];

        for (const recipeFood of recipeFoods) {
            const food = recipeFood.food || recipeFood;
            const foodId = food.id;

            // 在庫にない食材のみ追加
            if (!stockFoodIds.includes(foodId)) {
                // 既に買い物リストに存在するかチェック（未購入のもの）
                const existing = await db.shopping_lists.findOne({
                    where: {
                        user_id: userId,
                        food_id: foodId,
                        is_purchased: false
                    }
                });

                if (!existing) {
                    const quantity = recipeFood.recipe_foods?.quantity || recipeFood.quantity || null;
                    const item = await this.create(userId, {
                        food_id: foodId,
                        quantity: quantity
                    });
                    createdItems.push(item);
                }
            }
        }

        return createdItems;
    }
};
