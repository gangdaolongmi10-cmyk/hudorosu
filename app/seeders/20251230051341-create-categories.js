'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
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
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};

