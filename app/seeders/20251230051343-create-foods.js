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

    // 食材の作成（大量データ）
    const foods = [];
    const now = new Date();
    
    // 肉類 (category_id: 1)
    const meats = ['牛肉', '豚肉', '鶏肉', '鶏もも肉', '鶏むね肉', '鶏ささみ', '鶏手羽先', '鶏手羽元', '鶏レバー', '牛ロース', '牛バラ', '牛もも', '牛ヒレ', '牛すじ', '豚ロース', '豚バラ', '豚もも', '豚ヒレ', '豚こま切れ', '合い挽き肉', '牛ひき肉', '豚ひき肉', '鶏ひき肉', 'ベーコン', 'ハム', 'ソーセージ', 'ウインナー', 'サラミ', '生ハム', 'ローストビーフ'];
    meats.forEach(name => {
      foods.push({ name, category_id: categoryMap['肉類'], created_at: now, updated_at: now });
    });

    // 魚介類 (category_id: 2)
    const seafood = ['鮭', 'マグロ', 'カツオ', 'サバ', 'アジ', 'イワシ', 'サンマ', 'ブリ', 'タイ', 'ヒラメ', 'カレイ', 'タラ', 'エビ', 'カニ', 'イカ', 'タコ', 'ホタテ', 'アサリ', 'シジミ', 'ハマグリ', '牡蠣', 'ムール貝', 'アワビ', 'ウニ', 'いくら', 'たらこ', '明太子', '数の子', 'しらす', 'ちりめんじゃこ', 'かつお節', '煮干し', '干物', 'さば缶', 'ツナ缶', 'いわし缶'];
    seafood.forEach(name => {
      foods.push({ name, category_id: categoryMap['魚介類'], created_at: now, updated_at: now });
    });

    // 卵・大豆製品 (category_id: 3)
    const eggSoy = ['卵', '鶏卵', 'うずら卵', '豆腐', '木綿豆腐', '絹ごし豆腐', '厚揚げ', '油揚げ', 'がんもどき', '納豆', '味噌', '醤油', '豆乳', 'きな粉', 'おから', '湯葉', '高野豆腐', 'テンペ', '豆もやし'];
    eggSoy.forEach(name => {
      foods.push({ name, category_id: categoryMap['卵・大豆製品'], created_at: now, updated_at: now });
    });

    // 野菜 (category_id: 4)
    const vegetables = ['白菜', 'キャベツ', 'レタス', 'ほうれん草', '小松菜', 'チンゲン菜', '水菜', '春菊', 'ブロッコリー', 'カリフラワー', 'アスパラガス', 'オクラ', 'モロヘイヤ', 'ニラ', 'ネギ', '玉ねぎ', '長ネギ', 'にんにく', '生姜', 'にんじん', '大根', 'かぶ', 'ごぼう', 'れんこん', 'さつまいも', 'じゃがいも', '里芋', '長芋', '山芋', 'きゅうり', 'トマト', 'ナス', 'ピーマン', 'パプリカ', 'ズッキーニ', 'かぼちゃ', '冬瓜', 'もやし', '豆苗', 'ルッコラ', 'クレソン', 'セロリ', 'パセリ', '三つ葉', '大葉', 'しそ', 'みょうが', 'わさび', 'しょうが', 'らっきょう', 'たけのこ', 'ふき', 'うど', 'わらび', 'ぜんまい', 'きくらげ', '干し椎茸', '切り干し大根', 'かんぴょう', 'ひじき', 'わかめ', 'もずく', '昆布', 'のり', '青のり'];
    vegetables.forEach(name => {
      foods.push({ name, category_id: categoryMap['野菜'], created_at: now, updated_at: now });
    });

    // きのこ類 (category_id: 5)
    const mushrooms = ['しいたけ', 'えのき', 'しめじ', 'まいたけ', 'エリンギ', 'マッシュルーム', 'なめこ', 'きくらげ', '舞茸', '松茸', 'ひらたけ', 'ぶなしめじ'];
    mushrooms.forEach(name => {
      foods.push({ name, category_id: categoryMap['きのこ類'], created_at: now, updated_at: now });
    });

    // 果物 (category_id: 6)
    const fruits = ['りんご', 'みかん', 'オレンジ', 'グレープフルーツ', 'レモン', 'いちご', 'バナナ', 'ぶどう', 'もも', 'すもも', 'さくらんぼ', '梨', '柿', 'キウイフルーツ', 'パイナップル', 'マンゴー', 'メロン', 'スイカ', 'いちじく', 'ブルーベリー', 'ラズベリー', 'クランベリー', 'パパイヤ', 'ドラゴンフルーツ', 'ライチ', 'マンゴスチン', 'ココナッツ', 'アボカド', 'ドライフルーツ', 'レーズン', 'プルーン', '干し柿'];
    fruits.forEach(name => {
      foods.push({ name, category_id: categoryMap['果物'], created_at: now, updated_at: now });
    });

    // 米・シリアル (category_id: 7)
    const riceCereal = ['米', '白米', '玄米', 'もち米', '雑穀米', '麦', '大麦', 'オーツ麦', '小麦', 'ライ麦', 'とうもろこし', 'コーンフレーク', 'グラノーラ', 'シリアル', 'オートミール', 'クスクス', 'キヌア', 'アマランサス', 'ひえ', 'あわ', 'きび'];
    riceCereal.forEach(name => {
      foods.push({ name, category_id: categoryMap['米・シリアル'], created_at: now, updated_at: now });
    });

    // 麺類 (category_id: 8)
    const noodles = ['うどん', 'そば', 'ラーメン', 'パスタ', 'スパゲッティ', 'マカロニ', 'ペンネ', 'フェットチーネ', 'そうめん', 'ひやむぎ', 'きしめん', '冷やし中華', '焼きそば', 'フォー', 'ビーフン', '春雨', 'くずきり', 'ところてん'];
    noodles.forEach(name => {
      foods.push({ name, category_id: categoryMap['麺類'], created_at: now, updated_at: now });
    });

    // パン類 (category_id: 9)
    const breads = ['食パン', 'フランスパン', 'バゲット', 'クロワッサン', 'ベーグル', 'イングリッシュマフィン', 'ナン', 'ピタパン', 'フォカッチャ', 'パン粉', 'クラッカー', 'ビスケット', 'クッキー', 'プレッツェル'];
    breads.forEach(name => {
      foods.push({ name, category_id: categoryMap['パン類'], created_at: now, updated_at: now });
    });

    // 乳製品 (category_id: 10)
    const dairy = ['牛乳', '低脂肪乳', '無脂肪乳', '豆乳', 'アーモンドミルク', 'ココナッツミルク', 'ヨーグルト', 'ギリシャヨーグルト', 'チーズ', 'モッツァレラチーズ', 'チェダーチーズ', 'カマンベールチーズ', 'クリームチーズ', 'パルメザンチーズ', 'バター', 'マーガリン', '生クリーム', 'サワークリーム', 'カッテージチーズ', 'リコッタチーズ', 'アイスクリーム', 'シャーベット', '練乳', 'コンデンスミルク'];
    dairy.forEach(name => {
      foods.push({ name, category_id: categoryMap['乳製品'], created_at: now, updated_at: now });
    });

    // 缶詰・瓶詰 (category_id: 11)
    const canned = ['トマト缶', 'コーン缶', 'ツナ缶', 'さば缶', 'いわし缶', 'あさり缶', 'パイナップル缶', 'みかん缶', '桃缶', 'さくらんぼ缶', 'ジャム', 'マーマレード', 'ピクルス', 'オリーブ', 'アンチョビ', 'オイルサーディン'];
    canned.forEach(name => {
      foods.push({ name, category_id: categoryMap['缶詰・瓶詰'], created_at: now, updated_at: now });
    });

    // 冷凍食品 (category_id: 12)
    const frozen = ['冷凍野菜', '冷凍いちご', '冷凍ブルーベリー', '冷凍エビ', '冷凍イカ', '冷凍ホタテ', '冷凍うどん', '冷凍ごはん', '冷凍パン', '冷凍ピザ', '冷凍餃子', '冷凍シュウマイ', '冷凍コロッケ', '冷凍唐揚げ', '冷凍ハンバーグ', '冷凍グラタン', '冷凍フライドポテト'];
    frozen.forEach(name => {
      foods.push({ name, category_id: categoryMap['冷凍食品'], created_at: now, updated_at: now });
    });

    // 調味料・油 (category_id: 13)
    const seasonings = ['塩', 'こしょう', '砂糖', '三温糖', 'きび砂糖', 'はちみつ', 'メープルシロップ', '醤油', '味噌', 'みりん', '酒', '料理酒', '酢', '米酢', 'りんご酢', 'バルサミコ酢', 'オリーブオイル', 'サラダ油', 'ごま油', 'ココナッツオイル', 'アボカドオイル', 'マヨネーズ', 'ケチャップ', 'ウスターソース', '中濃ソース', 'オイスターソース', '豆板醤', '甜麺醤', 'コチュジャン', 'ナンプラー', '魚醤', 'だしの素', 'コンソメ', 'ブイヨン', 'カレー粉', 'チリパウダー', 'パプリカパウダー', 'クミン', 'コリアンダー', 'ターメリック', 'シナモン', 'ナツメグ', 'バニラエッセンス', 'バニラビーンズ', 'ゼラチン', '寒天', '片栗粉', '小麦粉', '強力粉', '薄力粉', 'ベーキングパウダー', '重曹', 'ドライイースト'];
    seasonings.forEach(name => {
      foods.push({ name, category_id: categoryMap['調味料・油'], created_at: now, updated_at: now });
    });

    // お菓子・スイーツ (category_id: 14)
    const sweets = ['チョコレート', 'ミルクチョコレート', 'ダークチョコレート', 'ホワイトチョコレート', 'キャンディ', 'キャラメル', 'グミ', 'ゼリー', 'プリン', 'ケーキ', 'シュークリーム', 'エクレア', 'マカロン', 'マフィン', 'ドーナツ', 'ワッフル', 'パンケーキミックス', '和菓子', 'ようかん', 'まんじゅう', 'どら焼き', 'たい焼き', 'おはぎ', '大福', 'みたらし団子', 'あんこ', 'きなこ', 'ポテトチップス', 'コーンポタージュ', 'せんべい', 'あられ'];
    sweets.forEach(name => {
      foods.push({ name, category_id: categoryMap['お菓子・スイーツ'], created_at: now, updated_at: now });
    });

    // 飲料・酒類 (category_id: 15)
    const drinks = ['水', 'ミネラルウォーター', 'お茶', '緑茶', '紅茶', 'ウーロン茶', 'ジャスミンティー', 'ハーブティー', 'コーヒー', 'インスタントコーヒー', 'エスプレッソ', 'カフェラテ', 'ココア', 'コーラ', 'サイダー', 'オレンジジュース', 'りんごジュース', 'グレープジュース', 'トマトジュース', '野菜ジュース', 'スポーツドリンク', 'エナジードリンク', 'ビール', '日本酒', 'ワイン', 'ウイスキー', '焼酎', '梅酒', 'カクテル'];
    drinks.forEach(name => {
      foods.push({ name, category_id: categoryMap['飲料・酒類'], created_at: now, updated_at: now });
    });

    // その他 (category_id: 16)
    const others = ['ナッツ', 'アーモンド', 'カシューナッツ', 'ピスタチオ', 'くるみ', 'マカダミアナッツ', 'ピーカンナッツ', 'ヘーゼルナッツ', 'ブラジルナッツ', '松の実', 'かぼちゃの種', 'ひまわりの種', 'ごま', '白ごま', '黒ごま', '金ごま', '海苔', 'わかめ', '昆布', 'もずく', 'ところてん', '寒天', 'ゼラチン', 'ベーキングパウダー', 'イースト', 'パン酵母'];
    others.forEach(name => {
      foods.push({ name, category_id: categoryMap['その他'], created_at: now, updated_at: now });
    });

    await queryInterface.bulkInsert('foods', foods);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('foods', null, {});
  }
};

