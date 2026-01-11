const db = require('../../models');

export const faqRepository = {
    /**
     * すべてのFAQを取得する（表示順でソート）
     * 
     * @description FAQをorder順、ID順で取得する
     * @returns FAQの配列
     */
    async findAll() {
        return await db.faqs.findAll({
            attributes: ['id', 'question', 'answer', 'order'],
            order: [['order', 'ASC'], ['id', 'ASC']]
        });
    },

    /**
     * IDでFAQを取得する
     * 
     * @param id FAQ ID
     * @returns FAQ情報
     */
    async findById(id: number) {
        return await db.faqs.findByPk(id);
    },

    /**
     * FAQの総数を取得する
     * 
     * @description 登録されているFAQの総数を返す
     * @returns FAQの総数
     */
    async count() {
        return await db.faqs.count();
    },

    /**
     * FAQを作成する
     * 
     * @param data FAQ作成データ
     * @returns 作成されたFAQ
     */
    async create(data: { question: string; answer: string; order?: number }) {
        return await db.faqs.create({
            question: data.question,
            answer: data.answer,
            order: data.order ?? 0,
        });
    },

    /**
     * FAQを更新する
     * 
     * @param id FAQ ID
     * @param data 更新データ
     * @returns 更新されたFAQ
     */
    async update(id: number, data: { question?: string; answer?: string; order?: number }) {
        const faq = await db.faqs.findByPk(id);
        if (!faq) {
            throw new Error('FAQが見つかりません');
        }
        await faq.update(data);
        return faq;
    },

    /**
     * FAQを削除する
     * 
     * @param id FAQ ID
     */
    async delete(id: number) {
        const faq = await db.faqs.findByPk(id);
        if (!faq) {
            throw new Error('FAQが見つかりません');
        }
        await faq.destroy();
    }
};

