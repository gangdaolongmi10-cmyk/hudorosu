const fs = require('fs');
const path = require('path');

const recipesData = require('../data/recipes.json');

// 新しい記事50個を生成
const newRecipes = [];

const categories = [
  { id: 'setsuyaku-recipe', name: '節約レシピ' },
  { id: 'shokuzai-kanri', name: '食材管理' },
  { id: 'foodloss-sakugen', name: 'フードロス削減' }
];

// 節約レシピ系の記事（20個）
const setsuyakuTemplates = [
  { title: '鶏胸肉100gで作る！250円節約レシピ', slug: 'tori-mune-100g-250yen', cost: '250円', time: '15分', keywords: ['鶏胸肉 100g', '250円 レシピ', '節約レシピ', '低カロリー'] },
  { title: 'ささみ大量消費！節約レシピ5選', slug: 'sasami-tairyou-shouhi', cost: '300円', time: '20分', keywords: ['ささみ 大量消費', '節約レシピ', '低カロリー', '高タンパク'] },
  { title: '豚こま切れ肉活用！節約レシピ集', slug: 'buta-komagire-katsuyou', cost: '350円', time: '20分', keywords: ['豚こま切れ肉', '節約レシピ', '炒め物', '時短'] },
  { title: '合いびき肉活用！節約レシピ5選', slug: 'aibiki-niku-katsuyou', cost: '400円', time: '25分', keywords: ['合いびき肉', '節約レシピ', 'ハンバーグ', 'ミートソース'] },
  { title: '鶏ひき肉活用！節約レシピ集', slug: 'tori-hikiniku-katsuyou', cost: '350円', time: '20分', keywords: ['鶏ひき肉', '節約レシピ', 'つくね', '麻婆豆腐'] },
  { title: '魚の切り身活用！節約レシピ5選', slug: 'sakana-kirimi-katsuyou', cost: '400円', time: '20分', keywords: ['魚 切り身', '節約レシピ', '焼き魚', '煮魚'] },
  { title: 'サーモン活用！節約レシピ集', slug: 'salmon-katsuyou-setsuyaku', cost: '500円', time: '15分', keywords: ['サーモン', '節約レシピ', '生食', '焼き魚'] },
  { title: 'エビ活用！節約レシピ5選', slug: 'ebi-katsuyou-setsuyaku', cost: '450円', time: '20分', keywords: ['エビ', '節約レシピ', '炒め物', '天ぷら'] },
  { title: 'イカ活用！節約レシピ集', slug: 'ika-katsuyou-setsuyaku', cost: '400円', time: '20分', keywords: ['イカ', '節約レシピ', '炒め物', '焼き物'] },
  { title: 'タコ活用！節約レシピ5選', slug: 'tako-katsuyou-setsuyaku', cost: '450円', time: '20分', keywords: ['タコ', '節約レシピ', 'サラダ', '炒め物'] },
  { title: 'きのこ大量消費！節約レシピ集', slug: 'kinoko-tairyou-shouhi', cost: '300円', time: '15分', keywords: ['きのこ 大量消費', '節約レシピ', '炒め物', 'スープ'] },
  { title: 'しめじ大量消費！節約レシピ5選', slug: 'shimeji-tairyou-shouhi', cost: '250円', time: '15分', keywords: ['しめじ 大量消費', '節約レシピ', '炒め物', 'スープ'] },
  { title: 'えのき大量消費！節約レシピ集', slug: 'enoki-tairyou-shouhi', cost: '200円', time: '15分', keywords: ['えのき 大量消費', '節約レシピ', '炒め物', 'スープ'] },
  { title: 'まいたけ大量消費！節約レシピ5選', slug: 'maitake-tairyou-shouhi', cost: '300円', time: '15分', keywords: ['まいたけ 大量消費', '節約レシピ', '炒め物', 'スープ'] },
  { title: 'えりんぎ大量消費！節約レシピ集', slug: 'eringi-tairyou-shouhi', cost: '350円', time: '15分', keywords: ['えりんぎ 大量消費', '節約レシピ', '炒め物', '焼き物'] },
  { title: 'わかめ活用！節約レシピ5選', slug: 'wakame-katsuyou-setsuyaku', cost: '200円', time: '10分', keywords: ['わかめ 活用', '節約レシピ', 'サラダ', 'スープ'] },
  { title: 'ひじき大量消費！節約レシピ集', slug: 'hijiki-tairyou-shouhi', cost: '250円', time: '20分', keywords: ['ひじき 大量消費', '節約レシピ', '常備菜', '煮物'] },
  { title: 'こんにゃく活用！節約レシピ5選', slug: 'konnyaku-katsuyou-setsuyaku', cost: '200円', time: '15分', keywords: ['こんにゃく 活用', '節約レシピ', '低カロリー', '炒め物'] },
  { title: 'しらたき活用！節約レシピ集', slug: 'shirataki-katsuyou-setsuyaku', cost: '200円', time: '15分', keywords: ['しらたき 活用', '節約レシピ', '低カロリー', '麺類'] },
  { title: '豆腐大量消費！節約レシピ5選', slug: 'tofu-tairyou-shouhi', cost: '300円', time: '20分', keywords: ['豆腐 大量消費', '節約レシピ', '低カロリー', '高タンパク'] }
];

// 食材管理系の記事（15個）
const shokuzaiKanriTemplates = [
  { title: '冷蔵庫の温度管理！食材を長持ちさせる方法', slug: 'reizouko-ondo-kanri', cost: '0円', time: '10分', keywords: ['冷蔵庫 温度管理', '食材管理', '長持ち', '保存'] },
  { title: '冷凍庫の整理術！効率的に管理する方法', slug: 'reitouko-seiri-jutsu-2', cost: '0円', time: '25分', keywords: ['冷凍庫 整理術', '食材管理', '効率化', '整理'] },
  { title: '野菜保存袋活用！長持ちさせる方法', slug: 'yasai-hozon-bukuro', cost: '0円', time: '5分', keywords: ['野菜 保存袋', '長持ち', '保存', '食材管理'] },
  { title: '真空パック保存術！食材を長持ちさせる', slug: 'shinkuu-pack-hozon', cost: '0円', time: '15分', keywords: ['真空パック', '保存', '長持ち', '食材管理'] },
  { title: 'ジップロック活用！食材保存のコツ', slug: 'ziploc-katsuyou', cost: '0円', time: '10分', keywords: ['ジップロック', '保存', '食材管理', '便利'] },
  { title: 'ラップ保存術！食材を長持ちさせる方法', slug: 'wrap-hozon-jutsu', cost: '0円', time: '5分', keywords: ['ラップ 保存', '長持ち', '食材管理', '便利'] },
  { title: 'アルミホイル保存術！食材を長持ちさせる', slug: 'aluminum-foil-hozon', cost: '0円', time: '5分', keywords: ['アルミホイル', '保存', '長持ち', '食材管理'] },
  { title: '保存容器選び術！食材を長持ちさせる', slug: 'hozon-youki-erabi', cost: '0円', time: '15分', keywords: ['保存容器', '選び方', '長持ち', '食材管理'] },
  { title: '食材ラベル作成術！期限を管理する方法', slug: 'shokuzai-label-sakusei', cost: '0円', time: '10分', keywords: ['食材 ラベル', '期限管理', '食材管理', 'ふどろす'] },
  { title: '食材在庫表作成術！在庫を把握する方法', slug: 'shokuzai-zaiko-hyou', cost: '0円', time: '20分', keywords: ['食材 在庫表', '在庫管理', '把握', '食材管理'] },
  { title: '食材購入日記録術！管理する方法', slug: 'shokuzai-kounyuu-nikki', cost: '0円', time: '10分', keywords: ['食材 購入日', '記録', '管理', '食材管理'] },
  { title: '食材消費日記録術！管理する方法', slug: 'shokuzai-shouhi-nikki', cost: '0円', time: '10分', keywords: ['食材 消費日', '記録', '管理', '食材管理'] },
  { title: '食材価格記録術！節約する方法', slug: 'shokuzai-kakaku-kiroku', cost: '0円', time: '10分', keywords: ['食材 価格', '記録', '節約', '食材管理'] },
  { title: '食材店舗記録術！安い店を見つける方法', slug: 'shokuzai-tenpo-kiroku', cost: '0円', time: '10分', keywords: ['食材 店舗', '記録', '節約', '食材管理'] },
  { title: '食材レシート管理術！記録する方法', slug: 'shokuzai-receipt-kanri', cost: '0円', time: '10分', keywords: ['食材 レシート', '管理', '記録', '食材管理'] }
];

// フードロス削減系の記事（15個）
const foodlossTemplates = [
  { title: 'フードロス削減レシピ！残り物活用術', slug: 'foodloss-sakugen-recipe', cost: '0円', time: '30分', keywords: ['フードロス削減', 'レシピ', '残り物活用', 'リメイク'] },
  { title: 'フードロス削減アイデア！家庭でできる10選', slug: 'foodloss-sakugen-idea-10', cost: '0円', time: '30分', keywords: ['フードロス削減', 'アイデア', '家庭', '10選'] },
  { title: 'フードロス削減チャレンジ！30日間取り組む', slug: 'foodloss-sakugen-challenge', cost: '0円', time: '30分', keywords: ['フードロス削減', 'チャレンジ', '30日間', '取り組み'] },
  { title: 'フードロス削減記録！効果を測る方法', slug: 'foodloss-sakugen-kiroku', cost: '0円', time: '15分', keywords: ['フードロス削減', '記録', '効果測定', '管理'] },
  { title: 'フードロス削減目標設定！達成する方法', slug: 'foodloss-sakugen-mokuhyou-settei', cost: '0円', time: '15分', keywords: ['フードロス削減', '目標設定', '達成', '管理'] },
  { title: 'フードロス削減習慣化！続ける方法', slug: 'foodloss-sakugen-shuukan-ka', cost: '0円', time: '20分', keywords: ['フードロス削減', '習慣化', '続ける', '継続'] },
  { title: 'フードロス削減家族会議！話し合う方法', slug: 'foodloss-sakugen-kazoku-kaigi', cost: '0円', time: '30分', keywords: ['フードロス削減', '家族会議', '話し合い', '協力'] },
  { title: 'フードロス削減友達と！一緒に取り組む', slug: 'foodloss-sakugen-tomodachi', cost: '0円', time: '20分', keywords: ['フードロス削減', '友達', '一緒に', '協力'] },
  { title: 'フードロス削減SNS投稿！発信する方法', slug: 'foodloss-sakugen-sns-toukou', cost: '0円', time: '15分', keywords: ['フードロス削減', 'SNS', '投稿', '発信'] },
  { title: 'フードロス削減写真記録！記録する方法', slug: 'foodloss-sakugen-photo-kiroku', cost: '0円', time: '10分', keywords: ['フードロス削減', '写真', '記録', '管理'] },
  { title: 'フードロス削減動画作成！発信する方法', slug: 'foodloss-sakugen-video-sakusei', cost: '0円', time: '30分', keywords: ['フードロス削減', '動画', '作成', '発信'] },
  { title: 'フードロス削減ポッドキャスト！聞く方法', slug: 'foodloss-sakugen-podcast', cost: '0円', time: '15分', keywords: ['フードロス削減', 'ポッドキャスト', '聞く', '学習'] },
  { title: 'フードロス削減オンライン講座！学ぶ方法', slug: 'foodloss-sakugen-online-kouza', cost: '0円', time: '30分', keywords: ['フードロス削減', 'オンライン講座', '学習', '教育'] },
  { title: 'フードロス削減コミュニティ！参加する方法', slug: 'foodloss-sakugen-community', cost: '0円', time: '15分', keywords: ['フードロス削減', 'コミュニティ', '参加', '交流'] },
  { title: 'フードロス削減ボランティア！参加する方法', slug: 'foodloss-sakugen-volunteer', cost: '0円', time: '30分', keywords: ['フードロス削減', 'ボランティア', '参加', '社会貢献'] }
];

// 記事を生成する関数
function generateRecipe(template, category) {
  const ingredients = generateIngredients(template);
  const steps = generateSteps(template, ingredients);
  const relatedSlugs = generateRelatedSlugs(template.slug, category);

  return {
    slug: template.slug,
    title: template.title,
    description: `${template.title}。${category.name}に関する記事です。ふどろすで食材を管理すれば、無駄なく使えます。`,
    keywords: [...template.keywords, 'ふどろす', category.name],
    categoryId: category.id,
    category: category.name,
    cost: template.cost,
    time: template.time,
    servings: template.servings || '2人分',
    ingredients: ingredients,
    steps: steps,
    tips: generateTips(template),
    relatedSlugs: relatedSlugs
  };
}

function generateIngredients(template) {
  const baseIngredients = [
    '冷蔵庫の余り野菜（何でもOK）',
    'しょうゆ 大さじ1',
    'ごま油 小さじ1',
    '塩・こしょう 少々'
  ];

  if (template.title.includes('鶏') || template.title.includes('ささみ')) {
    baseIngredients.unshift('鶏肉 100g');
  }
  if (template.title.includes('豚')) {
    baseIngredients.unshift('豚肉 100g');
  }
  if (template.title.includes('魚') || template.title.includes('サーモン') || template.title.includes('エビ') || template.title.includes('イカ') || template.title.includes('タコ')) {
    baseIngredients.unshift('魚介類 100g');
  }
  if (template.title.includes('きのこ') || template.title.includes('しめじ') || template.title.includes('えのき') || template.title.includes('まいたけ') || template.title.includes('えりんぎ')) {
    baseIngredients.unshift('きのこ類 1パック');
  }
  if (template.title.includes('豆腐')) {
    baseIngredients.unshift('豆腐 1丁');
  }
  if (template.title.includes('わかめ') || template.title.includes('ひじき')) {
    baseIngredients.unshift('海藻類 適量');
  }
  if (template.title.includes('こんにゃく') || template.title.includes('しらたき')) {
    baseIngredients.unshift('こんにゃく 1枚');
  }

  // 食材管理やフードロス削減の記事は材料なし
  if (template.cost === '0円') {
    return [];
  }

  return baseIngredients.slice(0, 6);
}

function generateSteps(template, ingredients) {
  // 食材管理やフードロス削減の記事は手順を簡略化
  if (template.cost === '0円') {
    if (template.categoryId === 'shokuzai-kanri') {
      return [
        'ふどろすアプリを開く。',
        '食材を登録する。',
        '管理方法を実践する。',
        '定期的に確認する。',
        'ふどろすで食材を管理すれば、無駄なく使えます！'
      ];
    } else {
      return [
        'フードロス削減の方法を理解する。',
        '実践できる方法を選ぶ。',
        '毎日の習慣にする。',
        '効果を確認する。',
        'ふどろすで食材を管理すれば、フードロスを削減できます！'
      ];
    }
  }

  const steps = [
    '冷蔵庫の余り物を確認する（ふどろすアプリで確認すると便利です）。',
    '材料を準備する。',
    'フライパンや鍋を準備する。',
    '調理を開始する。',
    '完成したら、ふどろすで食材を更新しましょう！'
  ];

  if (template.title.includes('炒め')) {
    steps[3] = 'フライパンにごま油を熱し、材料を炒める。';
  } else if (template.title.includes('煮')) {
    steps[3] = '鍋に材料を入れ、煮込む。';
  } else if (template.title.includes('焼')) {
    steps[3] = 'オーブンやフライパンで焼く。';
  } else if (template.title.includes('きのこ') || template.title.includes('しめじ') || template.title.includes('えのき')) {
    steps[3] = 'フライパンで炒めるか、スープに入れる。';
  }

  return steps;
}

function generateTips(template) {
  const tips = [
    'ふどろすで冷蔵庫の中身を確認してから作ると、無駄なく使えます！',
    '給料日前の節約にも最適です。',
    '作り置きしておけば、忙しい日も助かります。',
    'ふどろすで食材を管理すれば、フードロスを削減できます。'
  ];
  return tips[Math.floor(Math.random() * tips.length)];
}

function generateRelatedSlugs(currentSlug, category) {
  const allSlugs = recipesData.recipes
    .filter(r => r.categoryId === category.id && r.slug !== currentSlug)
    .map(r => r.slug);
  
  return allSlugs.slice(0, 3);
}

// 記事を生成
setsuyakuTemplates.forEach(template => {
  newRecipes.push(generateRecipe(template, categories[0]));
});

shokuzaiKanriTemplates.forEach(template => {
  newRecipes.push(generateRecipe(template, categories[1]));
});

foodlossTemplates.forEach(template => {
  newRecipes.push(generateRecipe(template, categories[2]));
});

// 既存のrecipesに追加
recipesData.recipes.push(...newRecipes);

// JSONファイルに書き込む
const outputPath = path.join(__dirname, '../data/recipes.json');
fs.writeFileSync(outputPath, JSON.stringify(recipesData, null, 2), 'utf8');

console.log(`✅ ${newRecipes.length}個の記事を追加しました！`);
console.log(`合計: ${recipesData.recipes.length}個の記事`);
