'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 食材とアレルギーの関連付け
    const insertedFoods = await queryInterface.sequelize.query(
      "SELECT id, name FROM foods ORDER BY id",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    const insertedAllergens = await queryInterface.sequelize.query(
      "SELECT id, name FROM allergens ORDER BY id",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    const allergenMap = {};
    insertedAllergens.forEach(alg => {
      allergenMap[alg.name] = alg.id;
    });

    const foodAllergens = [];
    
    // 食材名からアレルギーを自動的に関連付け
    insertedFoods.forEach(food => {
      const foodName = food.name.toLowerCase();
      
      // 各アレルギー物質をチェック
      insertedAllergens.forEach(alg => {
        const allergenName = alg.name.toLowerCase();
        if (foodName.includes(allergenName) || allergenName.includes(foodName)) {
          foodAllergens.push({
            food_id: food.id,
            allergen_id: alg.id
          });
        }
      });
      
      // 特定の食材とアレルギーの関連付け
      if (foodName.includes('卵') || foodName.includes('うずら')) {
        if (!foodAllergens.some(fa => fa.food_id === food.id && fa.allergen_id === allergenMap['卵'])) {
          foodAllergens.push({ food_id: food.id, allergen_id: allergenMap['卵'] });
        }
      }
      if (foodName.includes('乳') || foodName.includes('牛乳') || foodName.includes('チーズ') || foodName.includes('バター') || foodName.includes('ヨーグルト')) {
        if (!foodAllergens.some(fa => fa.food_id === food.id && fa.allergen_id === allergenMap['乳'])) {
          foodAllergens.push({ food_id: food.id, allergen_id: allergenMap['乳'] });
        }
      }
      if (foodName.includes('小麦') || foodName.includes('パン') || foodName.includes('うどん') || foodName.includes('パスタ') || foodName.includes('ラーメン')) {
        if (!foodAllergens.some(fa => fa.food_id === food.id && fa.allergen_id === allergenMap['小麦'])) {
          foodAllergens.push({ food_id: food.id, allergen_id: allergenMap['小麦'] });
        }
      }
      if (foodName.includes('えび') || foodName.includes('エビ')) {
        if (!foodAllergens.some(fa => fa.food_id === food.id && fa.allergen_id === allergenMap['えび'])) {
          foodAllergens.push({ food_id: food.id, allergen_id: allergenMap['えび'] });
        }
      }
      if (foodName.includes('かに') || foodName.includes('カニ')) {
        if (!foodAllergens.some(fa => fa.food_id === food.id && fa.allergen_id === allergenMap['かに'])) {
          foodAllergens.push({ food_id: food.id, allergen_id: allergenMap['かに'] });
        }
      }
      if (foodName.includes('そば')) {
        if (!foodAllergens.some(fa => fa.food_id === food.id && fa.allergen_id === allergenMap['そば'])) {
          foodAllergens.push({ food_id: food.id, allergen_id: allergenMap['そば'] });
        }
      }
      if (foodName.includes('落花生') || foodName.includes('ピーナッツ')) {
        if (!foodAllergens.some(fa => fa.food_id === food.id && fa.allergen_id === allergenMap['落花生'])) {
          foodAllergens.push({ food_id: food.id, allergen_id: allergenMap['落花生'] });
        }
      }
      if (foodName.includes('大豆') || foodName.includes('豆腐') || foodName.includes('納豆') || foodName.includes('味噌') || foodName.includes('醤油')) {
        if (!foodAllergens.some(fa => fa.food_id === food.id && fa.allergen_id === allergenMap['大豆'])) {
          foodAllergens.push({ food_id: food.id, allergen_id: allergenMap['大豆'] });
        }
      }
      if (foodName.includes('ごま')) {
        if (!foodAllergens.some(fa => fa.food_id === food.id && fa.allergen_id === allergenMap['ごま'])) {
          foodAllergens.push({ food_id: food.id, allergen_id: allergenMap['ごま'] });
        }
      }
    });

    if (foodAllergens.length > 0) {
      await queryInterface.bulkInsert('food_allergens', foodAllergens);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('food_allergens', null, {});
  }
};

