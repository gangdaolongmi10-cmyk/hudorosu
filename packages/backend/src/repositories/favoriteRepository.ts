const db = require('../../models');

export const favoriteRepository = {
    /**
     * ユーザーのお気に入りレシピ一覧を取得する
     * 
     * @param userId ユーザーID
     * @returns お気に入りレシピの配列
     */
    async findByUserId(userId: number) {
        const favorites = await db.user_recipe_favorites.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: db.recipes,
                    as: 'recipe',
                    attributes: ['id', 'name', 'description', 'image_url', 'cooking_time', 'servings', 'instructions', 'created_at', 'updated_at'],
                    include: [
                        {
                            model: db.foods,
                            as: 'food_id_foods',
                            attributes: ['id', 'name', 'category_id', 'price'],
                            through: {
                                attributes: ['quantity']
                            },
                            include: [
                                {
                                    model: db.categories,
                                    as: 'category',
                                    attributes: ['id', 'name']
                                },
                                {
                                    model: db.allergens,
                                    as: 'allergen_id_allergens',
                                    attributes: ['id', 'name'],
                                    through: {
                                        attributes: []
                                    }
                                }
                            ]
                        }
                    ]
                }
            ],
            order: [['created_at', 'DESC']]
        });

        return favorites.map((favorite: any) => favorite.recipe);
    },

    /**
     * ユーザーがレシピをお気に入りに登録しているか確認する
     * 
     * @param userId ユーザーID
     * @param recipeId レシピID
     * @returns お気に入りに登録されているかどうか
     */
    async isFavorite(userId: number, recipeId: number): Promise<boolean> {
        const favorite = await db.user_recipe_favorites.findOne({
            where: {
                user_id: userId,
                recipe_id: recipeId
            }
        });

        return !!favorite;
    },

    /**
     * 複数のレシピIDについて、お気に入り状態を取得する
     * 
     * @param userId ユーザーID
     * @param recipeIds レシピIDの配列
     * @returns お気に入りに登録されているレシピIDの配列
     */
    async getFavoriteRecipeIds(userId: number, recipeIds: number[]): Promise<number[]> {
        if (recipeIds.length === 0) return [];

        const favorites = await db.user_recipe_favorites.findAll({
            where: {
                user_id: userId,
                recipe_id: recipeIds
            },
            attributes: ['recipe_id']
        });

        return favorites.map((favorite: any) => favorite.recipe_id);
    },

    /**
     * お気に入りに追加する
     * 
     * @param userId ユーザーID
     * @param recipeId レシピID
     * @returns 作成されたお気に入り
     */
    async add(userId: number, recipeId: number) {
        const [favorite, created] = await db.user_recipe_favorites.findOrCreate({
            where: {
                user_id: userId,
                recipe_id: recipeId
            },
            defaults: {
                user_id: userId,
                recipe_id: recipeId
            }
        });

        if (!created) {
            throw new Error('既にお気に入りに登録されています');
        }

        return favorite;
    },

    /**
     * お気に入りから削除する
     * 
     * @param userId ユーザーID
     * @param recipeId レシピID
     */
    async remove(userId: number, recipeId: number) {
        const favorite = await db.user_recipe_favorites.findOne({
            where: {
                user_id: userId,
                recipe_id: recipeId
            }
        });

        if (!favorite) {
            throw new Error('お気に入りに登録されていません');
        }

        await favorite.destroy();
    },

    /**
     * お気に入りのトグル（追加/削除を切り替え）
     * 
     * @param userId ユーザーID
     * @param recipeId レシピID
     * @returns お気に入りに追加されたかどうか
     */
    async toggle(userId: number, recipeId: number): Promise<boolean> {
        const favorite = await db.user_recipe_favorites.findOne({
            where: {
                user_id: userId,
                recipe_id: recipeId
            }
        });

        if (favorite) {
            await favorite.destroy();
            return false; // 削除された
        } else {
            await db.user_recipe_favorites.create({
                user_id: userId,
                recipe_id: recipeId
            });
            return true; // 追加された
        }
    }
};
