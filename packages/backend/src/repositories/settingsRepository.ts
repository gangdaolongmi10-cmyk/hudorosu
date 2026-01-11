const db = require('../../models');

export const settingsRepository = {
    /**
     * すべての設定を取得する
     * 
     * @returns 設定の配列
     */
    async findAll() {
        return await db.settings.findAll({
            attributes: ['id', 'key', 'value', 'description', 'created_at', 'updated_at'],
            order: [['key', 'ASC']]
        });
    },

    /**
     * キーで設定を取得する
     * 
     * @param key 設定キー
     * @returns 設定情報
     */
    async findByKey(key: string) {
        return await db.settings.findOne({
            where: { key },
            attributes: ['id', 'key', 'value', 'description', 'created_at', 'updated_at']
        });
    },

    /**
     * 設定を更新する（存在しない場合は作成）
     * 
     * @param key 設定キー
     * @param value 設定値
     * @param description 説明（オプション）
     * @returns 更新された設定
     */
    async upsert(key: string, value: string, description?: string) {
        const [setting, created] = await db.settings.findOrCreate({
            where: { key },
            defaults: {
                key,
                value,
                description: description || null
            }
        });

        if (!created) {
            await setting.update({
                value,
                description: description !== undefined ? description : setting.description
            });
        }

        return setting;
    },

    /**
     * 複数の設定を一括更新する
     * 
     * @param settings 設定のオブジェクト（key-value形式）
     * @returns 更新された設定の配列
     */
    async updateMultiple(settings: Record<string, string>) {
        const results = [];
        for (const [key, value] of Object.entries(settings)) {
            const setting = await this.upsert(key, value);
            results.push(setting);
        }
        return results;
    }
};

