'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // アレルギー物質の作成（特定原材料7品目 + 特定原材料に準ずるもの20品目）
    await queryInterface.bulkInsert('allergens', [
      // 特定原材料7品目
      { name: '卵' },
      { name: '乳' },
      { name: '小麦' },
      { name: 'えび' },
      { name: 'かに' },
      { name: 'そば' },
      { name: '落花生' },
      // 特定原材料に準ずるもの20品目
      { name: 'あわび' },
      { name: 'いか' },
      { name: 'いくら' },
      { name: 'オレンジ' },
      { name: 'カシューナッツ' },
      { name: 'キウイフルーツ' },
      { name: '牛肉' },
      { name: 'くるみ' },
      { name: 'ごま' },
      { name: 'さけ' },
      { name: 'さば' },
      { name: '大豆' },
      { name: '鶏肉' },
      { name: 'バナナ' },
      { name: '豚肉' },
      { name: 'まつたけ' },
      { name: 'もも' },
      { name: 'やまいも' },
      { name: 'りんご' },
      { name: 'ゼラチン' }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('allergens', null, {});
  }
};

