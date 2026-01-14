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
  { title: '牛肉100gで作る！500円節約レシピ', slug: 'gyu-niku-100g-500yen', cost: '500円', time: '20分', keywords: ['牛肉 100g', '500円 レシピ', '節約レシピ', '高級食材'] },
  { title: 'ラム肉活用！節約レシピ5選', slug: 'ramu-niku-katsuyou', cost: '600円', time: '25分', keywords: ['ラム肉', '節約レシピ', '焼き肉', 'ジンギスカン'] },
  { title: '鶏手羽先大量消費！節約レシピ集', slug: 'tori-tebasaki-tairyou', cost: '400円', time: '30分', keywords: ['鶏手羽先', '大量消費', '節約レシピ', '煮込み'] },
  { title: '鶏もも肉丸ごと活用！節約レシピ5選', slug: 'tori-momo-marugoto', cost: '500円', time: '35分', keywords: ['鶏もも肉', '丸ごと', '節約レシピ', 'ロースト'] },
  { title: '豚ロース活用！節約レシピ集', slug: 'buta-roast-katsuyou', cost: '600円', time: '30分', keywords: ['豚ロース', '節約レシピ', 'とんかつ', '焼き肉'] },
  { title: '豚バラ塊活用！節約レシピ5選', slug: 'buta-bara-katamari', cost: '500円', time: '40分', keywords: ['豚バラ塊', '節約レシピ', '角煮', '煮込み'] },
  { title: '白身魚活用！節約レシピ集', slug: 'shiromi-sakana-katsuyou', cost: '400円', time: '20分', keywords: ['白身魚', '節約レシピ', '焼き魚', '煮魚'] },
  { title: '青魚活用！節約レシピ5選', slug: 'ao-sakana-katsuyou', cost: '350円', time: '20分', keywords: ['青魚', '節約レシピ', '健康', 'DHA'] },
  { title: '貝類活用！節約レシピ集', slug: 'kairui-katsuyou', cost: '450円', time: '25分', keywords: ['貝類', '節約レシピ', '酒蒸し', 'パスタ'] },
  { title: 'かぼちゃ大量消費！節約レシピ5選', slug: 'kabocha-tairyou-shouhi', cost: '300円', time: '25分', keywords: ['かぼちゃ 大量消費', '節約レシピ', '煮物', 'スープ'] },
  { title: 'さつまいも大量消費！節約レシピ集', slug: 'satsumaimo-tairyou', cost: '250円', time: '30分', keywords: ['さつまいも 大量消費', '節約レシピ', '焼き芋', 'スイートポテト'] },
  { title: '里芋大量消費！節約レシピ5選', slug: 'satoimo-tairyou', cost: '300円', time: '30分', keywords: ['里芋 大量消費', '節約レシピ', '煮物', 'コロッケ'] },
  { title: 'れんこん大量消費！節約レシピ集', slug: 'renkon-tairyou', cost: '300円', time: '20分', keywords: ['れんこん 大量消費', '節約レシピ', 'きんぴら', 'サラダ'] },
  { title: 'ごぼう大量消費！節約レシピ5選', slug: 'gobou-tairyou', cost: '250円', time: '20分', keywords: ['ごぼう 大量消費', '節約レシピ', 'きんぴら', 'サラダ'] },
  { title: 'れんこんとごぼう！節約レシピ集', slug: 'renkon-gobou-setsuyaku', cost: '300円', time: '20分', keywords: ['れんこん ごぼう', '節約レシピ', 'きんぴら', '常備菜'] },
  { title: 'オクラ大量消費！節約レシピ5選', slug: 'okura-tairyou', cost: '200円', time: '15分', keywords: ['オクラ 大量消費', '節約レシピ', '和え物', '天ぷら'] },
  { title: 'ズッキーニ大量消費！節約レシピ集', slug: 'zucchini-tairyou', cost: '300円', time: '20分', keywords: ['ズッキーニ 大量消費', '節約レシピ', '炒め物', 'パスタ'] },
  { title: 'パプリカ大量消費！節約レシピ5選', slug: 'paprika-tairyou', cost: '350円', time: '20分', keywords: ['パプリカ 大量消費', '節約レシピ', '炒め物', 'サラダ'] },
  { title: 'アスパラガス大量消費！節約レシピ集', slug: 'asparagus-tairyou', cost: '400円', time: '15分', keywords: ['アスパラガス 大量消費', '節約レシピ', '炒め物', 'サラダ'] },
  { title: 'ブロッコリースプラウト大量消費！節約レシピ', slug: 'broccoli-sprout-tairyou', cost: '200円', time: '10分', keywords: ['ブロッコリースプラウト', '大量消費', '節約レシピ', 'サラダ'] }
];

// 食材管理系の記事（15個）
const shokuzaiKanriTemplates = [
  { title: '食材冷凍保存術！長持ちさせる方法', slug: 'shokuzai-reitou-hozon-2', cost: '0円', time: '20分', keywords: ['食材 冷凍保存', '長持ち', '保存方法', '食材管理'] },
  { title: '食材解凍術！美味しく解凍する方法', slug: 'shokuzai-kaitou-jutsu', cost: '0円', time: '15分', keywords: ['食材 解凍', '美味しく', '解凍方法', '食材管理'] },
  { title: '食材下処理術！保存前に処理する方法', slug: 'shokuzai-shitashori', cost: '0円', time: '25分', keywords: ['食材 下処理', '保存前', '処理方法', '食材管理'] },
  { title: '食材小分け保存術！使いやすく保存する', slug: 'shokuzai-kowake-hozon', cost: '0円', time: '20分', keywords: ['食材 小分け', '保存', '使いやすく', '食材管理'] },
  { title: '食材パック詰め術！効率的に保存する', slug: 'shokuzai-pack-tsume', cost: '0円', time: '15分', keywords: ['食材 パック詰め', '保存', '効率的', '食材管理'] },
  { title: '食材タッパー保存術！長持ちさせる', slug: 'shokuzai-tupperware-hozon', cost: '0円', time: '10分', keywords: ['食材 タッパー', '保存', '長持ち', '食材管理'] },
  { title: '食材瓶保存術！長期保存する方法', slug: 'shokuzai-bin-hozon', cost: '0円', time: '30分', keywords: ['食材 瓶保存', '長期保存', '保存方法', '食材管理'] },
  { title: '食材乾燥保存術！長期保存する方法', slug: 'shokuzai-kansou-hozon-2', cost: '0円', time: '40分', keywords: ['食材 乾燥保存', '長期保存', '保存方法', '食材管理'] },
  { title: '食材塩漬け保存術！長期保存する方法', slug: 'shokuzai-shiozuke-hozon', cost: '0円', time: '30分', keywords: ['食材 塩漬け', '長期保存', '保存方法', '食材管理'] },
  { title: '食材酢漬け保存術！長期保存する方法', slug: 'shokuzai-suzuke-hozon', cost: '0円', time: '30分', keywords: ['食材 酢漬け', '長期保存', '保存方法', '食材管理'] },
  { title: '食材オイル漬け保存術！長期保存する', slug: 'shokuzai-oilzuke-hozon', cost: '0円', time: '20分', keywords: ['食材 オイル漬け', '長期保存', '保存方法', '食材管理'] },
  { title: '食材ジャム保存術！長期保存する方法', slug: 'shokuzai-jam-hozon', cost: '0円', time: '40分', keywords: ['食材 ジャム', '長期保存', '保存方法', '食材管理'] },
  { title: '食材ピクルス保存術！長期保存する', slug: 'shokuzai-pickles-hozon', cost: '0円', time: '30分', keywords: ['食材 ピクルス', '長期保存', '保存方法', '食材管理'] },
  { title: '食材コンフィ保存術！長期保存する方法', slug: 'shokuzai-confit-hozon', cost: '0円', time: '50分', keywords: ['食材 コンフィ', '長期保存', '保存方法', '食材管理'] },
  { title: '食材燻製保存術！長期保存する方法', slug: 'shokuzai-kunsei-hozon', cost: '0円', time: '60分', keywords: ['食材 燻製', '長期保存', '保存方法', '食材管理'] }
];

// フードロス削減系の記事（15個）
const foodlossTemplates = [
  { title: 'フードロス削減測定！効果を数値化する', slug: 'foodloss-sakugen-sokutei', cost: '0円', time: '20分', keywords: ['フードロス削減', '測定', '効果', '数値化'] },
  { title: 'フードロス削減グラフ！可視化する方法', slug: 'foodloss-sakugen-graph', cost: '0円', time: '15分', keywords: ['フードロス削減', 'グラフ', '可視化', '管理'] },
  { title: 'フードロス削減アプリ比較！選ぶ方法', slug: 'foodloss-sakugen-app-hikaku', cost: '0円', time: '20分', keywords: ['フードロス削減', 'アプリ比較', '選ぶ', 'ふどろす'] },
  { title: 'フードロス削減ツール！便利なツール紹介', slug: 'foodloss-sakugen-tool', cost: '0円', time: '15分', keywords: ['フードロス削減', 'ツール', '便利', '紹介'] },
  { title: 'フードロス削減ガイド！初心者向け', slug: 'foodloss-sakugen-guide', cost: '0円', time: '25分', keywords: ['フードロス削減', 'ガイド', '初心者', '入門'] },
  { title: 'フードロス削減マニュアル！実践方法', slug: 'foodloss-sakugen-manual', cost: '0円', time: '30分', keywords: ['フードロス削減', 'マニュアル', '実践', '方法'] },
  { title: 'フードロス削減チェックリスト！確認する', slug: 'foodloss-sakugen-checklist', cost: '0円', time: '15分', keywords: ['フードロス削減', 'チェックリスト', '確認', '管理'] },
  { title: 'フードロス削減カレンダー！計画する', slug: 'foodloss-sakugen-calendar', cost: '0円', time: '15分', keywords: ['フードロス削減', 'カレンダー', '計画', '管理'] },
  { title: 'フードロス削減日記！記録する方法', slug: 'foodloss-sakugen-nikki', cost: '0円', time: '10分', keywords: ['フードロス削減', '日記', '記録', '管理'] },
  { title: 'フードロス削減レポート！報告する方法', slug: 'foodloss-sakugen-report', cost: '0円', time: '20分', keywords: ['フードロス削減', 'レポート', '報告', '管理'] },
  { title: 'フードロス削減プレゼン！発表する方法', slug: 'foodloss-sakugen-presentation', cost: '0円', time: '30分', keywords: ['フードロス削減', 'プレゼン', '発表', '発信'] },
  { title: 'フードロス削減ワークショップ！開催する', slug: 'foodloss-sakugen-workshop', cost: '0円', time: '60分', keywords: ['フードロス削減', 'ワークショップ', '開催', '教育'] },
  { title: 'フードロス削減キャンペーン！企画する', slug: 'foodloss-sakugen-campaign', cost: '0円', time: '30分', keywords: ['フードロス削減', 'キャンペーン', '企画', '発信'] },
  { title: 'フードロス削減プロジェクト！立ち上げる', slug: 'foodloss-sakugen-project', cost: '0円', time: '40分', keywords: ['フードロス削減', 'プロジェクト', '立ち上げ', '企画'] },
  { title: 'フードロス削減NPO！支援する方法', slug: 'foodloss-sakugen-npo', cost: '0円', time: '20分', keywords: ['フードロス削減', 'NPO', '支援', '社会貢献'] }
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

  if (template.title.includes('牛肉') || template.title.includes('ラム')) {
    baseIngredients.unshift('牛肉 100g');
  }
  if (template.title.includes('鶏手羽先') || template.title.includes('鶏もも肉丸ごと')) {
    baseIngredients.unshift('鶏肉 適量');
  }
  if (template.title.includes('豚ロース') || template.title.includes('豚バラ塊')) {
    baseIngredients.unshift('豚肉 適量');
  }
  if (template.title.includes('白身魚') || template.title.includes('青魚') || template.title.includes('貝類')) {
    baseIngredients.unshift('魚介類 適量');
  }
  if (template.title.includes('かぼちゃ') || template.title.includes('さつまいも') || template.title.includes('里芋')) {
    baseIngredients.unshift('根菜類 適量');
  }
  if (template.title.includes('れんこん') || template.title.includes('ごぼう')) {
    baseIngredients.unshift('根菜類 適量');
  }
  if (template.title.includes('オクラ') || template.title.includes('ズッキーニ') || template.title.includes('パプリカ') || template.title.includes('アスパラガス') || template.title.includes('ブロッコリースプラウト')) {
    baseIngredients.unshift('野菜類 適量');
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
        '保存方法を実践する。',
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
  } else if (template.title.includes('煮') || template.title.includes('煮込み') || template.title.includes('角煮')) {
    steps[3] = '鍋に材料を入れ、煮込む。';
  } else if (template.title.includes('焼') || template.title.includes('ロースト')) {
    steps[3] = 'オーブンやフライパンで焼く。';
  } else if (template.title.includes('蒸し') || template.title.includes('酒蒸し')) {
    steps[3] = '蒸し器で蒸す。';
  }

  return steps;
}

function generateTips(template) {
  const tips = [
    'ふどろすで冷蔵庫の中身を確認してから作ると、無駄なく使えます！',
    '給料日前の節約にも最適です。',
    '作り置きしておけば、忙しい日も助かります。',
    'ふどろすで食材を管理すれば、フードロスを削減できます。',
    '長期保存する場合は、ふどろすで期限を管理しましょう。'
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
