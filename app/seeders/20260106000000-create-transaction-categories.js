'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date();
    
    // 家計簿カテゴリのマスタデータ作成（user_id: null = 全ユーザー共通）
    await queryInterface.bulkInsert('transaction_categories', [
      // 支出カテゴリ
      { 
        user_id: null, 
        name: '食費', 
        description: '食材、外食、飲み物などの食事に関する支出',
        color: '#EF4444', // 赤
        created_at: now,
        updated_at: now
      },
      { 
        user_id: null, 
        name: '日用品', 
        description: '洗剤、トイレットペーパー、タオルなどの日用品',
        color: '#F59E0B', // オレンジ
        created_at: now,
        updated_at: now
      },
      { 
        user_id: null, 
        name: '交通費', 
        description: '電車、バス、タクシー、ガソリン代などの交通に関する支出',
        color: '#3B82F6', // 青
        created_at: now,
        updated_at: now
      },
      { 
        user_id: null, 
        name: '光熱費', 
        description: '電気、ガス、水道などの光熱費',
        color: '#10B981', // 緑
        created_at: now,
        updated_at: now
      },
      { 
        user_id: null, 
        name: '通信費', 
        description: 'スマホ、インターネット、固定電話などの通信費',
        color: '#8B5CF6', // 紫
        created_at: now,
        updated_at: now
      },
      { 
        user_id: null, 
        name: '医療費', 
        description: '病院、薬、健康診断などの医療に関する支出',
        color: '#EC4899', // ピンク
        created_at: now,
        updated_at: now
      },
      { 
        user_id: null, 
        name: '娯楽', 
        description: '映画、ゲーム、本、趣味などの娯楽に関する支出',
        color: '#06B6D4', // シアン
        created_at: now,
        updated_at: now
      },
      { 
        user_id: null, 
        name: '衣服', 
        description: '服、靴、アクセサリーなどの衣服に関する支出',
        color: '#F97316', // オレンジ
        created_at: now,
        updated_at: now
      },
      { 
        user_id: null, 
        name: '教育費', 
        description: '学費、教材、習い事などの教育に関する支出',
        color: '#6366F1', // インディゴ
        created_at: now,
        updated_at: now
      },
      { 
        user_id: null, 
        name: '住居費', 
        description: '家賃、住宅ローン、管理費などの住居に関する支出',
        color: '#14B8A6', // ティール
        created_at: now,
        updated_at: now
      },
      { 
        user_id: null, 
        name: '保険', 
        description: '生命保険、損害保険、健康保険などの保険料',
        color: '#84CC16', // ライム
        created_at: now,
        updated_at: now
      },
      { 
        user_id: null, 
        name: 'その他支出', 
        description: 'その他の支出',
        color: '#6B7280', // グレー
        created_at: now,
        updated_at: now
      },
      // 収入カテゴリ
      { 
        user_id: null, 
        name: '給与', 
        description: '会社からの給与',
        color: '#10B981', // 緑
        created_at: now,
        updated_at: now
      },
      { 
        user_id: null, 
        name: '賞与', 
        description: 'ボーナス、賞与',
        color: '#059669', // 濃い緑
        created_at: now,
        updated_at: now
      },
      { 
        user_id: null, 
        name: '副業', 
        description: '副業、アルバイトなどの収入',
        color: '#34D399', // 薄い緑
        created_at: now,
        updated_at: now
      },
      { 
        user_id: null, 
        name: '投資', 
        description: '株式、投資信託、配当などの投資による収入',
        color: '#22C55E', // 緑
        created_at: now,
        updated_at: now
      },
      { 
        user_id: null, 
        name: 'その他収入', 
        description: 'その他の収入',
        color: '#6EE7B7', // 薄い緑
        created_at: now,
        updated_at: now
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    // マスタデータのみ削除（user_idがnullのもの）
    await queryInterface.bulkDelete('transaction_categories', {
      user_id: null
    }, {});
  }
};

