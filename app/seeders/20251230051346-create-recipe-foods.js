'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date();
    
    // 食材を取得
    const insertedFoods = await queryInterface.sequelize.query(
      "SELECT id, name FROM foods ORDER BY id",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    // 料理を取得
    const insertedRecipes = await queryInterface.sequelize.query(
      "SELECT id, name FROM recipes ORDER BY id",
      { type: Sequelize.QueryTypes.SELECT }
    );

    // 料理と食材の対応表
    const recipeFoodsMap = {
      '親子丼': ['鶏もも肉', '卵', '玉ねぎ', '米', 'だしの素', '醤油', 'みりん', '砂糖'],
      'カレーライス': ['牛肉', '玉ねぎ', 'にんじん', 'じゃがいも', '米', 'カレー粉', 'バター'],
      'ハンバーグ': ['合い挽き肉', '玉ねぎ', 'パン粉', '卵', '牛乳', 'バター', 'ケチャップ', 'ウスターソース'],
      '麻婆豆腐': ['豆腐', '豚ひき肉', 'にんにく', '生姜', '豆板醤', '甜麺醤', '醤油', '片栗粉'],
      'オムライス': ['米', '鶏もも肉', '玉ねぎ', 'ケチャップ', '卵', 'バター', 'コンソメ'],
      '餃子': ['豚ひき肉', 'キャベツ', 'にら', 'にんにく', '生姜', '餃子の皮', 'ごま油', '醤油', '酢'],
      '唐揚げ': ['鶏もも肉', 'にんにく', '生姜', '醤油', '酒', '片栗粉', 'サラダ油'],
      '味噌ラーメン': ['ラーメン', '味噌', 'バター', 'にんにく', 'もやし', 'チャーシュー', '長ネギ'],
      'パスタ（カルボナーラ）': ['パスタ', 'ベーコン', '卵', '生クリーム', 'パルメザンチーズ', 'にんにく'],
      'サラダ': ['レタス', 'トマト', 'きゅうり', 'オリーブオイル', '酢', '塩', 'こしょう'],
      'チャーハン': ['米', '卵', '長ネギ', 'ハム', '醤油', 'ごま油'],
      '天ぷら': ['えび', 'さつまいも', 'なす', '天ぷら粉', 'サラダ油', '天つゆ'],
      'シチュー': ['牛肉', 'にんじん', 'じゃがいも', '玉ねぎ', '生クリーム', 'バター', '小麦粉'],
      '酢豚': ['豚ロース', 'ピーマン', '玉ねぎ', 'にんじん', '酢', '砂糖', 'ケチャップ', '醤油'],
      'エビチリ': ['えび', 'にんにく', '生姜', '豆板醤', '甜麺醤', 'ケチャップ', '砂糖'],
      '肉じゃが': ['牛肉', 'じゃがいも', 'にんじん', '玉ねぎ', '醤油', '砂糖', 'みりん'],
      'チキン南蛮': ['鶏もも肉', '卵', 'マヨネーズ', '玉ねぎ', 'パン粉', 'サラダ油'],
      'グラタン': ['鶏もも肉', '玉ねぎ', 'マッシュルーム', 'バター', '小麦粉', '牛乳', 'チーズ'],
      '生姜焼き': ['豚ロース', '生姜', '醤油', '酒', 'みりん', 'サラダ油'],
      'ナポリタン': ['スパゲッティ', 'ソーセージ', 'ピーマン', '玉ねぎ', 'ケチャップ', 'バター']
    };

    const recipeFoodsData = [];

    // 各料理に対して食材を関連付け
    for (const recipe of insertedRecipes) {
      const foodNames = recipeFoodsMap[recipe.name];
      if (foodNames) {
        for (const foodName of foodNames) {
          const food = insertedFoods.find(f => f.name === foodName);
          if (food) {
            recipeFoodsData.push({
              recipe_id: recipe.id,
              food_id: food.id,
              quantity: null,
              created_at: now,
              updated_at: now
            });
          }
        }
      }
    }

    if (recipeFoodsData.length > 0) {
      await queryInterface.bulkInsert('recipe_foods', recipeFoodsData);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('recipe_foods', null, {});
  }
};

