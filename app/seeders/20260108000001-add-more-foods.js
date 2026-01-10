'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // カテゴリーIDを取得
    const categories = await queryInterface.sequelize.query(
      "SELECT id, name FROM categories ORDER BY id",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });

    // 追加の食材データ
    const foods = [];
    const now = new Date();
    
    // 肉類の追加
    const moreMeats = ['牛タン', '牛ハツ', '牛レバー', '豚タン', '豚ハツ', '豚レバー', '鶏ハツ', '鶏砂肝', '鶏皮', '手羽中', '手羽先', '手羽元', 'ささみ', 'もも肉', 'むね肉', 'ラム肉', 'マトン', '鴨肉', '合鴨', 'うずら', '七面鳥'];
    moreMeats.forEach(name => {
      foods.push({ name, category_id: categoryMap['肉類'], user_id: null, created_at: now, updated_at: now });
    });

    // 魚介類の追加
    const moreSeafood = ['アナゴ', 'ウナギ', 'ハモ', 'カレイ', 'ヒラメ', 'タラ', 'メバル', 'カサゴ', 'キス', 'シラス', 'イクラ', 'タラコ', '明太子', '数の子', '白子', 'あん肝', 'ほたるいか', 'するめ', 'あたりめ', '干しエビ', '桜エビ', 'ちりめんじゃこ', 'しらす干し', '煮干し', 'かつお節', '削り節', '昆布', 'わかめ', 'もずく', 'ひじき', '青のり', 'あおさ', 'とろろ昆布', 'おぼろ昆布'];
    moreSeafood.forEach(name => {
      foods.push({ name, category_id: categoryMap['魚介類'], user_id: null, created_at: now, updated_at: now });
    });

    // 野菜の追加（重複を削除）
    const moreVegetables = ['ゴーヤ', 'つるむらさき', '空芯菜', 'ロケット', 'バジル', 'コリアンダー', 'ディル', 'タイム', 'ローズマリー', 'オレガノ', 'ミント', 'レモングラス', 'チャイブ', 'エシャロット', 'リーキ', 'ラディッシュ', '二十日大根', '自然薯', '菊芋', 'ヤーコン', 'バターナッツ', 'アコーンスカッシュ', 'ピクルス', 'きゅうりの酢漬け', 'パースニップ', 'セロリアック', 'フェンネル', 'アーティチョーク', 'グリーンアスパラ', 'ホワイトアスパラ', 'ロマネスコ', '紫キャベツ', 'サボイキャベツ', '芽キャベツ', 'ケール', 'コラードグリーン', 'スイスチャード'];
    moreVegetables.forEach(name => {
      foods.push({ name, category_id: categoryMap['野菜'], user_id: null, created_at: now, updated_at: now });
    });

    // きのこ類の追加（重複を削除）
    const moreMushrooms = ['ポルチーニ', 'トリュフ', 'ムキタケ', 'ハタケシメジ', 'ホンシメジ', 'クリタケ', 'ナラタケ', 'ハナイグチ', 'アミガサタケ', 'モリーユ', 'チャーガ', 'レイシ', '霊芝'];
    moreMushrooms.forEach(name => {
      foods.push({ name, category_id: categoryMap['きのこ類'], user_id: null, created_at: now, updated_at: now });
    });

    // 果物の追加（重複を削除）
    const moreFruits = ['ライム', 'ゆず', 'すだち', 'かぼす', 'きんかん', 'はっさく', 'いよかん', 'デコポン', '清見', '不知火', 'せとか', 'はるみ', '甘夏', '夏みかん', '文旦', 'ブンタン', 'ザボン', 'シークワーサー', 'タンカン', 'ネーブル', 'バレンシア', 'ブラッドオレンジ', 'カラカラ', 'オロブランコ', 'ルビー', 'ピンクグレープフルーツ', 'ホワイトグレープフルーツ', 'マンダリン', 'クレメンタイン', 'サツマ', '温州みかん', '紀州みかん', 'ポンカン', 'タンゴール', 'オロタンゴール', 'ミネオラ', 'タンジェロ'];
    moreFruits.forEach(name => {
      foods.push({ name, category_id: categoryMap['果物'], user_id: null, created_at: now, updated_at: now });
    });

    // 米・シリアルの追加（重複を削除）
    const moreRiceCereal = ['赤米', '黒米', '古代米', '発芽玄米', '分づき米', '五分づき米', '七分づき米', '胚芽米', '無洗米'];
    moreRiceCereal.forEach(name => {
      foods.push({ name, category_id: categoryMap['米・シリアル'], user_id: null, created_at: now, updated_at: now });
    });

    // 麺類の追加（重複を削除）
    const moreNoodles = ['フォー', 'ビーフン', 'アガー', 'カラギーナン', 'キサンタンガム', 'グアーガム', 'ローカストビーンガム', 'タピオカ', 'サゴ'];
    moreNoodles.forEach(name => {
      foods.push({ name, category_id: categoryMap['麺類'], user_id: null, created_at: now, updated_at: now });
    });

    // パン類の追加（重複を削除）
    const moreBreads = ['全粒粉パン', 'ライ麦パン', 'ブリオッシュ', 'パン・ド・ミー', 'パン・ド・カンパーニュ'];
    moreBreads.forEach(name => {
      foods.push({ name, category_id: categoryMap['パン類'], user_id: null, created_at: now, updated_at: now });
    });

    // 乳製品の追加（重複を削除、実用的なもののみ）
    const moreDairy = ['低脂肪乳', '無脂肪乳', 'オートミルク', 'ライスミルク', 'ヘンプミルク', 'カシューミルク', 'マカダミアミルク', 'フラックスミルク', 'キヌアミルク', 'アマランスミルク', 'テフミルク', 'ソルガムミルク', 'スペルトミルク', 'カムットミルク', 'グラスフェッドミルク', 'オーガニックミルク', '練乳', 'コンデンスミルク', 'エバミルク', '粉ミルク', 'スキムミルク', '全脂粉乳', '脱脂粉乳'];
    moreDairy.forEach(name => {
      foods.push({ name, category_id: categoryMap['乳製品'], user_id: null, created_at: now, updated_at: now });
    });

    // 既存の食材名をチェックして重複を避ける
    const existingFoods = await queryInterface.sequelize.query(
      "SELECT name FROM foods WHERE user_id IS NULL",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    const existingNames = new Set(existingFoods.map(f => f.name));
    const uniqueFoods = foods.filter(f => !existingNames.has(f.name));

    if (uniqueFoods.length > 0) {
      await queryInterface.bulkInsert('foods', uniqueFoods);
    }
  },

  async down (queryInterface, Sequelize) {
    // このシーダーで追加した食材を削除（名前で判定）
    const addedFoods = [
      // 肉類
      '牛タン', '牛ハツ', '牛レバー', '豚タン', '豚ハツ', '豚レバー', '鶏ハツ', '鶏砂肝', '鶏皮', '手羽中', '手羽先', '手羽元', 'ささみ', 'もも肉', 'むね肉', 'ラム肉', 'マトン', '鴨肉', '合鴨', 'うずら', '七面鳥',
      // 魚介類
      'アナゴ', 'ウナギ', 'ハモ', 'カレイ', 'ヒラメ', 'タラ', 'メバル', 'カサゴ', 'キス', 'シラス', 'イクラ', 'タラコ', '明太子', '数の子', '白子', 'あん肝', 'ほたるいか', 'するめ', 'あたりめ', '干しエビ', '桜エビ', 'ちりめんじゃこ', 'しらす干し', '煮干し', 'かつお節', '削り節', '昆布', 'わかめ', 'もずく', 'ひじき', '青のり', 'あおさ', 'とろろ昆布', 'おぼろ昆布',
      // 野菜
      'ゴーヤ', 'つるむらさき', '空芯菜', 'ロケット', 'バジル', 'コリアンダー', 'ディル', 'タイム', 'ローズマリー', 'オレガノ', 'ミント', 'レモングラス', 'チャイブ', 'エシャロット', 'リーキ', 'ラディッシュ', '二十日大根', '自然薯', '菊芋', 'ヤーコン', 'バターナッツ', 'アコーンスカッシュ', 'ピクルス', 'きゅうりの酢漬け', 'パースニップ', 'セロリアック', 'フェンネル', 'アーティチョーク', 'グリーンアスパラ', 'ホワイトアスパラ', 'ロマネスコ', '紫キャベツ', 'サボイキャベツ', '芽キャベツ', 'ケール', 'コラードグリーン', 'スイスチャード',
      // きのこ類
      'ポルチーニ', 'トリュフ', 'ムキタケ', 'ハタケシメジ', 'ホンシメジ', 'クリタケ', 'ナラタケ', 'ハナイグチ', 'アミガサタケ', 'モリーユ', 'チャーガ', 'レイシ', '霊芝',
      // 果物
      'ライム', 'ゆず', 'すだち', 'かぼす', 'きんかん', 'はっさく', 'いよかん', 'デコポン', '清見', '不知火', 'せとか', 'はるみ', '甘夏', '夏みかん', '文旦', 'ブンタン', 'ザボン', 'シークワーサー', 'タンカン', 'ネーブル', 'バレンシア', 'ブラッドオレンジ', 'カラカラ', 'オロブランコ', 'ルビー', 'ピンクグレープフルーツ', 'ホワイトグレープフルーツ', 'マンダリン', 'クレメンタイン', 'サツマ', '温州みかん', '紀州みかん', 'ポンカン', 'タンゴール', 'オロタンゴール', 'ミネオラ', 'タンジェロ',
      // 米・シリアル
      '赤米', '黒米', '古代米', '発芽玄米', '分づき米', '五分づき米', '七分づき米', '胚芽米', '無洗米',
      // 麺類
      'フォー', 'ビーフン', 'アガー', 'カラギーナン', 'キサンタンガム', 'グアーガム', 'ローカストビーンガム', 'タピオカ', 'サゴ',
      // パン類
      '全粒粉パン', 'ライ麦パン', 'ブリオッシュ', 'パン・ド・ミー', 'パン・ド・カンパーニュ',
      // 乳製品
      '低脂肪乳', '無脂肪乳', 'オートミルク', 'ライスミルク', 'ヘンプミルク', 'カシューミルク', 'マカダミアミルク', 'フラックスミルク', 'キヌアミルク', 'アマランスミルク', 'テフミルク', 'ソルガムミルク', 'スペルトミルク', 'カムットミルク', 'グラスフェッドミルク', 'オーガニックミルク', '練乳', 'コンデンスミルク', 'エバミルク', '粉ミルク', 'スキムミルク', '全脂粉乳', '脱脂粉乳'
    ];
    
    await queryInterface.sequelize.query(
      `DELETE FROM foods WHERE name IN (:names) AND user_id IS NULL`,
      {
        replacements: { names: addedFoods },
        type: Sequelize.QueryTypes.DELETE
      }
    );
  }
};

