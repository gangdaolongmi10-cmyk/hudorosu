const db = require('../../models');

export interface CreateRecipeData {
    name: string;
    description?: string | null;
    image_url?: string | null;
    cooking_time?: number | null;
    servings?: number | null;
    instructions?: string | null;
}

export interface UpdateRecipeData {
    name?: string;
    description?: string | null;
    image_url?: string | null;
    cooking_time?: number | null;
    servings?: number | null;
    instructions?: string | null;
}

export interface RecipeFoodData {
    food_id: number;
    quantity?: string | null;
}

export const recipeRepository = {
    /**
     * すべての料理を取得する
     * 
     * @description 料理をID順で取得し、食材とアレルギー情報も含める
     * @returns 料理の配列
     */
    async findAll() {
        return await db.recipes.findAll({
            include: [
                {
                    model: db.foods,
                    as: 'food_id_foods',
                    attributes: ['id', 'name', 'category_id'],
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
            ],
            attributes: ['id', 'name', 'description', 'image_url', 'cooking_time', 'servings', 'instructions', 'created_at', 'updated_at'],
            order: [['id', 'ASC']]
        });
    },

    /**
     * IDで料理を取得する
     * 
     * @param id 料理ID
     * @returns 料理情報（食材とアレルギー情報を含む）
     */
    async findById(id: number) {
        return await db.recipes.findOne({
            where: { id },
            include: [
                {
                    model: db.foods,
                    as: 'food_id_foods',
                    attributes: ['id', 'name', 'category_id'],
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
            ],
            attributes: ['id', 'name', 'description', 'image_url', 'cooking_time', 'servings', 'instructions', 'created_at', 'updated_at']
        });
    },

    /**
     * 料理の総数を取得する
     * 
     * @returns 料理の総数
     */
    async count() {
        return await db.recipes.count();
    },

    /**
     * 料理を作成する
     * 
     * @param data 料理作成データ
     * @param recipeFoods 使用食材の配列
     * @returns 作成された料理
     */
    async create(data: CreateRecipeData, recipeFoods?: RecipeFoodData[]) {
        const transaction = await db.sequelize.transaction();
        
        try {
            // 料理を作成
            const recipe = await db.recipes.create(data, { transaction });

            // 食材を紐付け
            if (recipeFoods && recipeFoods.length > 0) {
                for (const recipeFood of recipeFoods) {
                    await db.recipe_foods.create({
                        recipe_id: recipe.id,
                        food_id: recipeFood.food_id,
                        quantity: recipeFood.quantity || null
                    }, { transaction });
                }
            }

            await transaction.commit();

            // 作成された料理を再取得（関連情報を含む）
            return await this.findById(recipe.id);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    /**
     * 料理を更新する
     * 
     * @param id 料理ID
     * @param data 更新データ
     * @param recipeFoods 使用食材の配列（指定された場合、既存の食材関連を置き換える）
     * @returns 更新された料理
     */
    async update(id: number, data: UpdateRecipeData, recipeFoods?: RecipeFoodData[]) {
        const transaction = await db.sequelize.transaction();
        
        try {
            const recipe = await db.recipes.findOne({
                where: { id },
                transaction
            });

            if (!recipe) {
                throw new Error('料理が見つかりません');
            }

            // 料理情報を更新
            await recipe.update(data, { transaction });

            // 食材を更新（指定されている場合）
            if (recipeFoods !== undefined) {
                // 既存の食材関連を削除
                await db.recipe_foods.destroy({
                    where: { recipe_id: id },
                    transaction
                });

                // 新しい食材関連を作成
                if (recipeFoods.length > 0) {
                    for (const recipeFood of recipeFoods) {
                        await db.recipe_foods.create({
                            recipe_id: id,
                            food_id: recipeFood.food_id,
                            quantity: recipeFood.quantity || null
                        }, { transaction });
                    }
                }
            }

            await transaction.commit();

            // 更新された料理を再取得（関連情報を含む）
            return await this.findById(id);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    /**
     * 料理を削除する
     * 
     * @param id 料理ID
     */
    async delete(id: number) {
        const transaction = await db.sequelize.transaction();
        
        try {
            const recipe = await db.recipes.findOne({
                where: { id },
                transaction
            });

            if (!recipe) {
                throw new Error('料理が見つかりません');
            }

            // 食材関連を削除（CASCADEで自動削除されるが、明示的に削除）
            await db.recipe_foods.destroy({
                where: { recipe_id: id },
                transaction
            });

            // 料理を削除
            await recipe.destroy({ transaction });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    /**
     * 料理に含まれるすべてのアレルギーを取得する
     * 
     * @param id 料理ID
     * @returns アレルギーの配列（重複なし）
     */
    async getAllergensByRecipeId(id: number) {
        const recipe = await this.findById(id);
        if (!recipe) {
            return [];
        }

        // 料理に使用されている食材からアレルギーを収集
        const allergenMap = new Map<number, { id: number; name: string }>();
        
        if (recipe.food_id_foods) {
            for (const food of recipe.food_id_foods) {
                if (food.allergen_id_allergens) {
                    for (const allergen of food.allergen_id_allergens) {
                        if (!allergenMap.has(allergen.id)) {
                            allergenMap.set(allergen.id, {
                                id: allergen.id,
                                name: allergen.name
                            });
                        }
                    }
                }
            }
        }

        return Array.from(allergenMap.values());
    },

    /**
     * 在庫にある食材でレシピを取得する
     * 
     * @param stockFoodIds 在庫にある食材IDの配列
     * @returns 在庫にある食材を含むレシピの配列（在庫食材の割合が高い順）
     */
    async findByStockFoods(stockFoodIds: number[]) {
        if (!stockFoodIds || stockFoodIds.length === 0) {
            return [];
        }

        // 在庫にある食材を含むレシピを取得
        const recipes = await db.recipes.findAll({
            include: [
                {
                    model: db.foods,
                    as: 'food_id_foods',
                    attributes: ['id', 'name', 'category_id'],
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
            ],
            attributes: ['id', 'name', 'description', 'image_url', 'cooking_time', 'servings', 'instructions', 'created_at', 'updated_at'],
            order: [['id', 'ASC']]
        });

        // 在庫にある食材の割合を計算してソート
        const recipesWithScore = recipes.map((recipe: any) => {
            const recipeFoods = recipe.food_id_foods || [];
            const totalFoods = recipeFoods.length;
            const availableFoods = recipeFoods.filter((food: any) => 
                stockFoodIds.includes(food.id)
            ).length;
            
            const matchRatio = totalFoods > 0 ? availableFoods / totalFoods : 0;
            
            return {
                ...recipe.toJSON(),
                matchRatio,
                availableFoods,
                totalFoods
            };
        });

        // 在庫食材の割合が高い順、次に在庫食材数が多い順にソート
        recipesWithScore.sort((a: any, b: any) => {
            if (b.matchRatio !== a.matchRatio) {
                return b.matchRatio - a.matchRatio;
            }
            return b.availableFoods - a.availableFoods;
        });

        return recipesWithScore;
    }
};

