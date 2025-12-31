'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 管理者ユーザーの作成
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    
    await queryInterface.bulkInsert('users', [
      {
        email: adminEmail,
        name: '管理者',
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});

    // 作成されたユーザーのIDを取得
    const userId = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE email = :email",
      {
        replacements: { email: adminEmail },
        type: Sequelize.QueryTypes.SELECT
      }
    );

    if (userId && userId.length > 0) {
      // ローカル認証情報の作成
      await queryInterface.bulkInsert('local_auth', [
        {
          user_id: userId[0].id,
          password_hash: passwordHash
        }
      ], {});
    }

    // カテゴリーの作成
    await queryInterface.bulkInsert('categories', [
      // タンパク質・メイン
      { name: '肉類', created_at: new Date() },
      { name: '魚介類', created_at: new Date() },
      { name: '卵・大豆製品', created_at: new Date() },
      // 野菜・果物
      { name: '野菜', created_at: new Date() },
      { name: 'きのこ類', created_at: new Date() },
      { name: '果物', created_at: new Date() },
      // 主食
      { name: '米・シリアル', created_at: new Date() },
      { name: '麺類', created_at: new Date() },
      { name: 'パン類', created_at: new Date() },
      // 乳製品・保存食
      { name: '乳製品', created_at: new Date() },
      { name: '缶詰・瓶詰', created_at: new Date() },
      { name: '冷凍食品', created_at: new Date() },
      // 調味料・その他
      { name: '調味料・油', created_at: new Date() },
      { name: 'お菓子・スイーツ', created_at: new Date() },
      { name: '飲料・酒類', created_at: new Date() },
      { name: 'その他', created_at: new Date() }
    ], {});

    // アレルギー物質の作成
    await queryInterface.bulkInsert('allergens', [
      { name: '卵' }, { name: '乳' }, { name: '小麦' }, { name: 'えび' }
    ]);

    // 食材の作成
    await queryInterface.bulkInsert('foods', [
      { name: '牛肉', category_id: 1, created_at: new Date() },
      { name: '鮭', category_id: 2, created_at: new Date() },
      { name: '白菜', category_id: 3, created_at: new Date() },
      { name: 'その他', category_id: 4, created_at: new Date() }
    ]);
  },

  async down (queryInterface, Sequelize) {
    // 管理者ユーザーの削除
    const userId = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE email = :email",
      {
        replacements: { email: process.env.ADMIN_EMAIL || 'admin@example.com' },
        type: Sequelize.QueryTypes.SELECT
      }
    );

    if (userId && userId.length > 0) {
      await queryInterface.bulkDelete('local_auth', { user_id: userId[0].id }, {});
      await queryInterface.bulkDelete('users', { email: process.env.ADMIN_EMAIL || 'admin@example.com' }, {});
    }

    await queryInterface.bulkDelete('allergens', null, {});
    await queryInterface.bulkDelete('categories', null, {});
    await queryInterface.bulkDelete('foods', null, {});
  }
};
