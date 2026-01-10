const db = require('../../models');

export const foodRepository = {
    /**
     * マスタ食材（user_idがnull）をすべて取得する
     * 
     * @description マスタ食材をID順で取得し、カテゴリとアレルギー情報も含める
     * @returns マスタ食材の配列
     */
    async findAllMasterFoods() {
        return await db.foods.findAll({
            where: {
                user_id: null
            },
            include: [
                {
                    model: db.categories,
                    as: 'category',
                    attributes: ['id', 'name', 'description']
                },
                {
                    model: db.allergens,
                    as: 'allergen_id_allergens',
                    attributes: ['id', 'name'],
                    through: {
                        attributes: []
                    }
                }
            ],
            attributes: ['id', 'name', 'category_id', 'user_id', 'best_before_date', 'expiry_date', 'memo', 'calories', 'protein', 'fat', 'carbohydrate', 'fiber', 'sodium', 'serving_size', 'created_at', 'updated_at'],
            order: [['id', 'ASC']]
        });
    },

    /**
     * IDでマスタ食材を取得する
     * 
     * @param id 食材ID
     * @returns 食材情報
     */
    async findById(id: number) {
        return await db.foods.findOne({
            where: {
                id,
                user_id: null
            },
            include: [
                {
                    model: db.categories,
                    as: 'category',
                    attributes: ['id', 'name', 'description']
                },
                {
                    model: db.allergens,
                    as: 'allergen_id_allergens',
                    attributes: ['id', 'name'],
                    through: {
                        attributes: []
                    }
                }
            ],
            attributes: ['id', 'name', 'category_id', 'user_id', 'best_before_date', 'expiry_date', 'memo', 'created_at', 'updated_at']
        });
    },

    /**
     * マスタ食材（user_idがnull）の総数を取得する
     * 
     * @description 登録されているマスタ食材の総数を返す
     * @returns マスタ食材の総数
     */
    async countMasterFoods() {
        return await db.foods.count({
            where: {
                user_id: null
            }
        });
    },

    /**
     * マスタ食材を作成する
     * 
     * @param data 食材作成データ
     * @param allergenIds アレルゲンIDの配列
     * @returns 作成された食材
     */
    async create(data: {
        name: string;
        category_id: number;
        best_before_date?: string | null;
        expiry_date?: string | null;
        memo?: string | null;
        calories?: number | null;
        protein?: number | null;
        fat?: number | null;
        carbohydrate?: number | null;
        fiber?: number | null;
        sodium?: number | null;
        serving_size?: number | null;
    }, allergenIds?: number[]) {
        const transaction = await db.sequelize.transaction();
        
        try {
            // 食材を作成（user_idはnullでマスタ食材として登録）
            const food = await db.foods.create({
                ...data,
                user_id: null
            }, { transaction });

            // アレルゲンを紐付け
            if (allergenIds && allergenIds.length > 0) {
                await food.setAllergen_id_allergens(allergenIds, { transaction });
            }

            await transaction.commit();

            // 作成された食材を再取得（関連情報を含む）
            return await this.findById(food.id);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    /**
     * マスタ食材を更新する
     * 
     * @param id 食材ID
     * @param data 更新データ
     * @param allergenIds アレルゲンIDの配列
     * @returns 更新された食材
     */
    async update(id: number, data: {
        name?: string;
        category_id?: number;
        best_before_date?: string | null;
        expiry_date?: string | null;
        memo?: string | null;
        calories?: number | null;
        protein?: number | null;
        fat?: number | null;
        carbohydrate?: number | null;
        fiber?: number | null;
        sodium?: number | null;
        serving_size?: number | null;
    }, allergenIds?: number[]) {
        const transaction = await db.sequelize.transaction();
        
        try {
            const food = await db.foods.findOne({
                where: {
                    id,
                    user_id: null
                },
                transaction
            });

            if (!food) {
                throw new Error('食材が見つかりません');
            }

            // 食材情報を更新
            await food.update(data, { transaction });

            // アレルゲンを更新（指定されている場合）
            if (allergenIds !== undefined) {
                await food.setAllergen_id_allergens(allergenIds, { transaction });
            }

            await transaction.commit();

            // 更新された食材を再取得（関連情報を含む）
            return await this.findById(id);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    /**
     * マスタ食材を削除する
     * 
     * @param id 食材ID
     */
    async delete(id: number) {
        const transaction = await db.sequelize.transaction();
        
        try {
            const food = await db.foods.findOne({
                where: {
                    id,
                    user_id: null
                },
                transaction
            });

            if (!food) {
                throw new Error('食材が見つかりません');
            }

            // アレルゲンの関連を削除
            await food.setAllergen_id_allergens([], { transaction });

            // 食材を削除
            await food.destroy({ transaction });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    /**
     * カテゴリーIDでマスタ食材をページネーションで取得する
     * 
     * @param categoryId カテゴリーID
     * @param limit 取得件数の上限
     * @param offset オフセット
     * @returns 食材の配列と総数
     */
    async findByCategoryId(categoryId: number, limit: number, offset: number) {
        const { count, rows } = await db.foods.findAndCountAll({
            where: {
                category_id: categoryId,
                user_id: null
            },
            include: [
                {
                    model: db.categories,
                    as: 'category',
                    attributes: ['id', 'name', 'description']
                },
                {
                    model: db.allergens,
                    as: 'allergen_id_allergens',
                    attributes: ['id', 'name'],
                    through: {
                        attributes: []
                    }
                }
            ],
            attributes: ['id', 'name', 'category_id', 'user_id', 'best_before_date', 'expiry_date', 'memo', 'calories', 'protein', 'fat', 'carbohydrate', 'fiber', 'sodium', 'serving_size', 'created_at', 'updated_at'],
            order: [['id', 'ASC']],
            limit,
            offset
        });

        return {
            foods: rows,
            total: count
        };
    }
};

