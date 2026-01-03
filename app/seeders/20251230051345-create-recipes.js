'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date();
    
    // 料理のダミーデータ作成
    const recipes = [
      {
        name: '親子丼',
        description: '鶏肉と卵を使った定番の丼物',
        cooking_time: 15,
        servings: 2,
        instructions: '1. 鶏もも肉を一口大に切る\n2. 玉ねぎを薄切りにする\n3. だし汁、醤油、みりん、砂糖でタレを作る\n4. 鶏肉と玉ねぎを炒めてタレを加える\n5. 卵を溶いて流し入れ、半熟になったらご飯の上にのせる',
        foods: ['鶏もも肉', '卵', '玉ねぎ', '米', 'だしの素', '醤油', 'みりん', '砂糖']
      },
      {
        name: 'カレーライス',
        description: '日本の国民食、カレーライス',
        cooking_time: 45,
        servings: 4,
        instructions: '1. 牛肉を一口大に切る\n2. 玉ねぎ、にんじん、じゃがいもを切る\n3. 肉と野菜を炒める\n4. 水を加えて煮込む\n5. カレールウを加えてとろみをつける\n6. ご飯と一緒に盛り付ける',
        foods: ['牛肉', '玉ねぎ', 'にんじん', 'じゃがいも', '米', 'カレー粉', 'バター']
      },
      {
        name: 'ハンバーグ',
        description: 'ジューシーなハンバーグ',
        cooking_time: 30,
        servings: 4,
        instructions: '1. 合い挽き肉に玉ねぎのみじん切り、パン粉、卵、塩こしょうを加えて混ぜる\n2. 小判型に成形する\n3. フライパンで両面を焼く\n4. ソースを作る\n5. ハンバーグにソースをかける',
        foods: ['合い挽き肉', '玉ねぎ', 'パン粉', '卵', '牛乳', 'バター', 'ケチャップ', 'ウスターソース']
      },
      {
        name: '麻婆豆腐',
        description: '四川料理の定番、麻婆豆腐',
        cooking_time: 20,
        servings: 2,
        instructions: '1. 豆腐を切る\n2. ひき肉を炒める\n3. 豆板醤、甜麺醤を加える\n4. 豆腐を加えて煮る\n5. 水溶き片栗粉でとろみをつける',
        foods: ['豆腐', '豚ひき肉', 'にんにく', '生姜', '豆板醤', '甜麺醤', '醤油', '片栗粉']
      },
      {
        name: 'オムライス',
        description: 'ふわふわの卵で包んだオムライス',
        cooking_time: 25,
        servings: 2,
        instructions: '1. チキンライスを作る\n2. 卵を溶いてフライパンで薄く焼く\n3. チキンライスを卵で包む\n4. ケチャップでデコレーション',
        foods: ['米', '鶏もも肉', '玉ねぎ', 'ケチャップ', '卵', 'バター', 'コンソメ']
      },
      {
        name: '餃子',
        description: '手作り餃子',
        cooking_time: 40,
        servings: 4,
        instructions: '1. キャベツをみじん切りにして塩もみする\n2. 豚ひき肉、にら、にんにく、生姜を混ぜる\n3. 餃子の皮で包む\n4. フライパンで焼く\n5. 水を加えて蒸し焼きにする',
        foods: ['豚ひき肉', 'キャベツ', 'にら', 'にんにく', '生姜', '餃子の皮', 'ごま油', '醤油', '酢']
      },
      {
        name: '唐揚げ',
        description: 'サクサクの唐揚げ',
        cooking_time: 30,
        servings: 4,
        instructions: '1. 鶏もも肉を一口大に切る\n2. にんにく、生姜、醤油、酒で下味をつける\n3. 片栗粉をまぶす\n4. 高温の油で揚げる',
        foods: ['鶏もも肉', 'にんにく', '生姜', '醤油', '酒', '片栗粉', 'サラダ油']
      },
      {
        name: '味噌ラーメン',
        description: '濃厚な味噌ラーメン',
        cooking_time: 20,
        servings: 2,
        instructions: '1. ラーメンを作る\n2. 味噌、バター、にんにくでスープを作る\n3. もやし、もやし、チャーシューをトッピング',
        foods: ['ラーメン', '味噌', 'バター', 'にんにく', 'もやし', 'チャーシュー', '長ネギ']
      },
      {
        name: 'パスタ（カルボナーラ）',
        description: '濃厚なカルボナーラ',
        cooking_time: 15,
        servings: 2,
        instructions: '1. パスタを茹でる\n2. ベーコンを炒める\n3. 卵、生クリーム、パルメザンチーズを混ぜる\n4. パスタと合わせる',
        foods: ['パスタ', 'ベーコン', '卵', '生クリーム', 'パルメザンチーズ', 'にんにく']
      },
      {
        name: 'サラダ',
        description: 'フレッシュなサラダ',
        cooking_time: 10,
        servings: 2,
        instructions: '1. レタス、トマト、きゅうりを切る\n2. ドレッシングを作る\n3. 盛り付ける',
        foods: ['レタス', 'トマト', 'きゅうり', 'オリーブオイル', '酢', '塩', 'こしょう']
      },
      {
        name: 'チャーハン',
        description: 'パラパラのチャーハン',
        cooking_time: 15,
        servings: 2,
        instructions: '1. ご飯をほぐす\n2. 卵を炒める\n3. ご飯と具材を炒める\n4. 醤油で味付け',
        foods: ['米', '卵', '長ネギ', 'ハム', '醤油', 'ごま油']
      },
      {
        name: '天ぷら',
        description: 'サクサクの天ぷら',
        cooking_time: 30,
        servings: 4,
        instructions: '1. 野菜と魚を切る\n2. 天ぷら粉で衣を作る\n3. 高温の油で揚げる\n4. 天つゆでいただく',
        foods: ['えび', 'さつまいも', 'なす', '天ぷら粉', 'サラダ油', '天つゆ']
      },
      {
        name: 'シチュー',
        description: 'ホワイトシチュー',
        cooking_time: 60,
        servings: 4,
        instructions: '1. 牛肉を切る\n2. 野菜を切る\n3. 肉と野菜を炒める\n4. 水を加えて煮込む\n5. 生クリームとバターで仕上げる',
        foods: ['牛肉', 'にんじん', 'じゃがいも', '玉ねぎ', '生クリーム', 'バター', '小麦粉']
      },
      {
        name: '酢豚',
        description: '甘酸っぱい酢豚',
        cooking_time: 30,
        servings: 4,
        instructions: '1. 豚肉を切る\n2. 野菜を切る\n3. 肉と野菜を炒める\n4. 酢、砂糖、ケチャップでタレを作る\n5. 合わせて炒める',
        foods: ['豚ロース', 'ピーマン', '玉ねぎ', 'にんじん', '酢', '砂糖', 'ケチャップ', '醤油']
      },
      {
        name: 'エビチリ',
        description: '辛いエビチリ',
        cooking_time: 20,
        servings: 2,
        instructions: '1. えびを下処理する\n2. にんにく、生姜を炒める\n3. 豆板醤、甜麺醤を加える\n4. えびを炒める\n5. トマトケチャップで味付け',
        foods: ['えび', 'にんにく', '生姜', '豆板醤', '甜麺醤', 'ケチャップ', '砂糖']
      },
      {
        name: '肉じゃが',
        description: '日本の家庭料理の定番',
        cooking_time: 40,
        servings: 4,
        instructions: '1. 牛肉を切る\n2. じゃがいも、にんじん、玉ねぎを切る\n3. 肉を炒める\n4. 野菜を加えて煮る\n5. 醤油、砂糖、みりんで味付け',
        foods: ['牛肉', 'じゃがいも', 'にんじん', '玉ねぎ', '醤油', '砂糖', 'みりん']
      },
      {
        name: 'チキン南蛮',
        description: 'タルタルソースが決め手',
        cooking_time: 25,
        servings: 2,
        instructions: '1. 鶏もも肉を揚げる\n2. タルタルソースを作る\n3. 鶏肉にタルタルソースをかける',
        foods: ['鶏もも肉', '卵', 'マヨネーズ', '玉ねぎ', 'パン粉', 'サラダ油']
      },
      {
        name: 'グラタン',
        description: 'チーズがたっぷりのグラタン',
        cooking_time: 35,
        servings: 2,
        instructions: '1. ホワイトソースを作る\n2. 具材を炒める\n3. ホワイトソースと合わせる\n4. チーズをのせてオーブンで焼く',
        foods: ['鶏もも肉', '玉ねぎ', 'マッシュルーム', 'バター', '小麦粉', '牛乳', 'チーズ']
      },
      {
        name: '生姜焼き',
        description: 'ジューシーな生姜焼き',
        cooking_time: 15,
        servings: 2,
        instructions: '1. 豚ロースを切る\n2. 生姜、醤油、酒でタレを作る\n3. 豚肉を焼く\n4. タレをかける',
        foods: ['豚ロース', '生姜', '醤油', '酒', 'みりん', 'サラダ油']
      },
      {
        name: 'ナポリタン',
        description: 'ケチャップ味のスパゲッティ',
        cooking_time: 15,
        servings: 2,
        instructions: '1. パスタを茹でる\n2. ソーセージ、ピーマン、玉ねぎを炒める\n3. ケチャップで味付け\n4. パスタと合わせる',
        foods: ['スパゲッティ', 'ソーセージ', 'ピーマン', '玉ねぎ', 'ケチャップ', 'バター']
      }
    ];

    for (const recipe of recipes) {
      await queryInterface.bulkInsert('recipes', [{
        name: recipe.name,
        description: recipe.description,
        cooking_time: recipe.cooking_time,
        servings: recipe.servings,
        instructions: recipe.instructions,
        created_at: now,
        updated_at: now
      }], {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('recipes', null, {});
  }
};

