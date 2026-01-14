const fs = require('fs');
const path = require('path');

const recipesData = require('../data/recipes.json');

// 新しい記事100個を生成
const newRecipes = [];

const categories = [
  { id: 'setsuyaku-recipe', name: '節約レシピ' },
  { id: 'shokuzai-kanri', name: '食材管理' },
  { id: 'foodloss-sakugen', name: 'フードロス削減' }
];

// 節約レシピ系の記事（40個）
const setsuyakuTemplates = [
  { title: '鶏もも肉100gで作る！300円節約レシピ', slug: 'tori-momo-100g-300yen', cost: '300円', time: '20分', keywords: ['鶏もも肉 100g', '300円 レシピ', '節約レシピ', '給料日前'] },
  { title: '豆腐と卵で作る！200円以下のおかず', slug: 'tofu-tamago-200yen', cost: '200円', time: '10分', keywords: ['豆腐 卵', '200円以下', '節約レシピ', '簡単レシピ'] },
  { title: 'もやし大量消費！100円で作るボリュームおかず', slug: 'moyashi-100yen-okazu', cost: '100円', time: '15分', keywords: ['もやし 大量消費', '100円 レシピ', '節約レシピ', 'ボリューム'] },
  { title: '冷凍食品活用！500円で作る満足メニュー', slug: 'reitou-shokuhin-500yen', cost: '500円', time: '25分', keywords: ['冷凍食品', '500円 メニュー', '節約レシピ', '時短レシピ'] },
  { title: 'キャベツ1玉使い切り！節約レシピ5選', slug: 'cabbage-ichitama-setsuyaku', cost: '400円', time: '30分', keywords: ['キャベツ 1玉', '使い切り', '節約レシピ', '大量消費'] },
  { title: '玉ねぎ大量消費！節約おかずレシピ', slug: 'tamanegi-tairyou-shouhi', cost: '300円', time: '20分', keywords: ['玉ねぎ 大量消費', '節約おかず', '常備菜', '作り置き'] },
  { title: 'にんじん使い切り！節約レシピ3選', slug: 'ninjin-tsukaikiri-setsuyaku', cost: '250円', time: '15分', keywords: ['にんじん 使い切り', '節約レシピ', '常備菜', '作り置き'] },
  { title: 'じゃがいも大量消費！節約レシピ集', slug: 'jagaimo-tairyou-shouhi', cost: '350円', time: '25分', keywords: ['じゃがいも 大量消費', '節約レシピ', '主食', '満腹'] },
  { title: '納豆と卵で作る！100円以下のおかず', slug: 'natto-tamago-100yen', cost: '100円', time: '5分', keywords: ['納豆 卵', '100円以下', '節約レシピ', '簡単'] },
  { title: 'きゅうり大量消費！節約レシピ5選', slug: 'kyuuri-tairyou-shouhi', cost: '200円', time: '10分', keywords: ['きゅうり 大量消費', '節約レシピ', '常備菜', 'サラダ'] },
  { title: 'トマト大量消費！節約レシピ集', slug: 'tomato-tairyou-shouhi', cost: '300円', time: '15分', keywords: ['トマト 大量消費', '節約レシピ', 'パスタ', 'サラダ'] },
  { title: 'ピーマン大量消費！節約おかずレシピ', slug: 'piiman-tairyou-shouhi', cost: '250円', time: '20分', keywords: ['ピーマン 大量消費', '節約おかず', '肉詰め', '炒め物'] },
  { title: 'なす大量消費！節約レシピ5選', slug: 'nasu-tairyou-shouhi', cost: '300円', time: '25分', keywords: ['なす 大量消費', '節約レシピ', '焼きなす', '麻婆なす'] },
  { title: '白菜1玉使い切り！節約レシピ集', slug: 'hakusai-ichitama-setsuyaku', cost: '400円', time: '30分', keywords: ['白菜 1玉', '使い切り', '節約レシピ', '鍋物'] },
  { title: '大根1本使い切り！節約レシピ5選', slug: 'daikon-ippon-tsukaikiri', cost: '350円', time: '25分', keywords: ['大根 1本', '使い切り', '節約レシピ', 'おでん'] },
  { title: 'ブロッコリー大量消費！節約レシピ', slug: 'broccoli-tairyou-shouhi', cost: '300円', time: '15分', keywords: ['ブロッコリー 大量消費', '節約レシピ', 'サラダ', '炒め物'] },
  { title: 'ほうれん草大量消費！節約レシピ集', slug: 'hourensou-tairyou-shouhi', cost: '250円', time: '10分', keywords: ['ほうれん草 大量消費', '節約レシピ', 'おひたし', '炒め物'] },
  { title: '小松菜大量消費！節約おかずレシピ', slug: 'komatsuna-tairyou-shouhi', cost: '200円', time: '10分', keywords: ['小松菜 大量消費', '節約おかず', '炒め物', 'おひたし'] },
  { title: 'もやしと卵で作る！100円以下のおかず', slug: 'moyashi-tamago-100yen', cost: '100円', time: '10分', keywords: ['もやし 卵', '100円以下', '節約レシピ', '簡単'] },
  { title: '冷やごはん活用！節約レシピ5選', slug: 'hiyagohan-katsuyou', cost: '300円', time: '15分', keywords: ['冷やごはん', '節約レシピ', 'チャーハン', 'リメイク'] },
  { title: 'パン粉活用！節約レシピ集', slug: 'panko-katsuyou-setsuyaku', cost: '400円', time: '20分', keywords: ['パン粉 活用', '節約レシピ', 'とんかつ', 'フライ'] },
  { title: 'パスタ茹で汁活用！節約レシピ', slug: 'pasta-yudetiru-katsuyou', cost: '200円', time: '5分', keywords: ['パスタ 茹で汁', '節約レシピ', 'スープ', 'リメイク'] },
  { title: 'ごはん大量消費！節約レシピ5選', slug: 'gohan-tairyou-shouhi', cost: '350円', time: '20分', keywords: ['ごはん 大量消費', '節約レシピ', 'チャーハン', 'リゾット'] },
  { title: 'うどん活用！節約レシピ集', slug: 'udon-katsuyou-setsuyaku', cost: '300円', time: '15分', keywords: ['うどん 活用', '節約レシピ', '焼きうどん', 'リメイク'] },
  { title: 'そば活用！節約レシピ5選', slug: 'soba-katsuyou-setsuyaku', cost: '300円', time: '15分', keywords: ['そば 活用', '節約レシピ', '焼きそば', 'リメイク'] },
  { title: '冷凍ごはん活用！節約レシピ', slug: 'reitou-gohan-katsuyou', cost: '250円', time: '10分', keywords: ['冷凍ごはん', '節約レシピ', 'チャーハン', 'リメイク'] },
  { title: '残りごはん活用！節約レシピ5選', slug: 'nokori-gohan-katsuyou', cost: '300円', time: '15分', keywords: ['残りごはん', '節約レシピ', 'チャーハン', 'リメイク'] },
  { title: '冷凍野菜活用！節約レシピ集', slug: 'reitou-yasai-katsuyou', cost: '400円', time: '20分', keywords: ['冷凍野菜', '節約レシピ', '時短', '便利'] },
  { title: '缶詰活用！節約レシピ5選', slug: 'kandume-katsuyou-setsuyaku', cost: '350円', time: '15分', keywords: ['缶詰 活用', '節約レシピ', '常備', '時短'] },
  { title: '乾物活用！節約レシピ集', slug: 'kanbutsu-katsuyou-setsuyaku', cost: '300円', time: '20分', keywords: ['乾物 活用', '節約レシピ', '常備', '保存食'] },
  { title: '豆苗大量消費！節約レシピ', slug: 'toumyou-tairyou-shouhi', cost: '150円', time: '10分', keywords: ['豆苗 大量消費', '節約レシピ', 'サラダ', '炒め物'] },
  { title: 'もやしとツナで作る！200円以下のおかず', slug: 'moyashi-tsuna-200yen', cost: '200円', time: '10分', keywords: ['もやし ツナ', '200円以下', '節約レシピ', '簡単'] },
  { title: 'ツナ缶活用！節約レシピ5選', slug: 'tsuna-kan-katsuyou', cost: '300円', time: '15分', keywords: ['ツナ缶 活用', '節約レシピ', '常備', '時短'] },
  { title: 'サバ缶活用！節約レシピ集', slug: 'saba-kan-katsuyou', cost: '400円', time: '20分', keywords: ['サバ缶 活用', '節約レシピ', '常備', '健康'] },
  { title: 'イワシ缶活用！節約レシピ5選', slug: 'iwashi-kan-katsuyou', cost: '350円', time: '15分', keywords: ['イワシ缶 活用', '節約レシピ', '常備', '健康'] },
  { title: 'コーン缶活用！節約レシピ', slug: 'corn-kan-katsuyou', cost: '250円', time: '10分', keywords: ['コーン缶 活用', '節約レシピ', '常備', 'サラダ'] },
  { title: 'トマト缶活用！節約レシピ5選', slug: 'tomato-kan-katsuyou', cost: '300円', time: '20分', keywords: ['トマト缶 活用', '節約レシピ', 'パスタ', 'スープ'] },
  { title: 'ひじき活用！節約レシピ集', slug: 'hijiki-katsuyou-setsuyaku', cost: '200円', time: '15分', keywords: ['ひじき 活用', '節約レシピ', '常備菜', '健康'] },
  { title: '切り干し大根活用！節約レシピ', slug: 'kiriboshi-daikon-katsuyou', cost: '200円', time: '15分', keywords: ['切り干し大根 活用', '節約レシピ', '常備菜', '煮物'] },
  { title: '高野豆腐活用！節約レシピ5選', slug: 'koya-dofu-katsuyou', cost: '300円', time: '20分', keywords: ['高野豆腐 活用', '節約レシピ', '常備', '煮物'] }
];

// 食材管理系の記事（30個）
const shokuzaiKanriTemplates = [
  { title: '冷蔵庫整理術！食材を無駄にしない方法', slug: 'reizouko-seiri-jutsu', cost: '0円', time: '30分', keywords: ['冷蔵庫 整理術', '食材管理', '無駄削減', '整理整頓'] },
  { title: '賞味期限管理アプリ！ふどろすの使い方', slug: 'shoumi-kigen-kanri-app', cost: '0円', time: '10分', keywords: ['賞味期限 管理', 'アプリ', 'ふどろす', '食材管理'] },
  { title: '冷凍庫整理術！食材を長持ちさせる方法', slug: 'reitouko-seiri-jutsu', cost: '0円', time: '20分', keywords: ['冷凍庫 整理術', '食材管理', '保存', '長持ち'] },
  { title: '野菜室整理術！野菜を長持ちさせるコツ', slug: 'yasai-shitsu-seiri-jutsu', cost: '0円', time: '15分', keywords: ['野菜室 整理術', '野菜 保存', '長持ち', '食材管理'] },
  { title: '買い物リスト作成術！無駄買いを防ぐ方法', slug: 'kaimono-list-sakusei', cost: '0円', time: '10分', keywords: ['買い物リスト', '無駄買い', '節約', '食材管理'] },
  { title: '食材在庫管理！冷蔵庫の中身を把握する方法', slug: 'shokuzai-zaiko-kanri', cost: '0円', time: '15分', keywords: ['食材 在庫管理', '冷蔵庫', '把握', '食材管理'] },
  { title: '食材ローテーション術！古いものから使う方法', slug: 'shokuzai-rotation-jutsu', cost: '0円', time: '10分', keywords: ['食材 ローテーション', '古いものから', '食材管理', '無駄削減'] },
  { title: '冷蔵庫の見える化！食材管理のコツ', slug: 'reizouko-mieruka', cost: '0円', time: '20分', keywords: ['冷蔵庫 見える化', '食材管理', '整理', '把握'] },
  { title: '食材保存術！長持ちさせる方法まとめ', slug: 'shokuzai-hozon-jutsu', cost: '0円', time: '25分', keywords: ['食材 保存術', '長持ち', '保存方法', '食材管理'] },
  { title: '冷凍保存術！食材を長持ちさせるコツ', slug: 'reitou-hozon-jutsu', cost: '0円', time: '20分', keywords: ['冷凍保存', '長持ち', '保存方法', '食材管理'] },
  { title: '乾燥保存術！食材を長持ちさせる方法', slug: 'kansou-hozon-jutsu', cost: '0円', time: '15分', keywords: ['乾燥保存', '長持ち', '保存方法', '食材管理'] },
  { title: '漬物保存術！食材を長持ちさせるコツ', slug: 'tsukemono-hozon-jutsu', cost: '0円', time: '30分', keywords: ['漬物 保存', '長持ち', '保存方法', '食材管理'] },
  { title: '食材カテゴリ分け術！整理整頓のコツ', slug: 'shokuzai-category-wake', cost: '0円', time: '15分', keywords: ['食材 カテゴリ分け', '整理整頓', '食材管理', '効率化'] },
  { title: '冷蔵庫ゾーン分け術！食材管理のコツ', slug: 'reizouko-zone-wake', cost: '0円', time: '20分', keywords: ['冷蔵庫 ゾーン分け', '食材管理', '整理', '効率化'] },
  { title: '食材ラベル管理術！賞味期限を把握する方法', slug: 'shokuzai-label-kanri', cost: '0円', time: '10分', keywords: ['食材 ラベル管理', '賞味期限', '把握', '食材管理'] },
  { title: '食材アプリ活用術！ふどろすで管理する方法', slug: 'shokuzai-app-katsuyou', cost: '0円', time: '10分', keywords: ['食材 アプリ', 'ふどろす', '管理', '効率化'] },
  { title: '食材通知設定術！賞味期限を忘れない方法', slug: 'shokuzai-notification-settei', cost: '0円', time: '5分', keywords: ['食材 通知', '賞味期限', '忘れない', 'ふどろす'] },
  { title: '食材写真管理術！視覚的に把握する方法', slug: 'shokuzai-photo-kanri', cost: '0円', time: '10分', keywords: ['食材 写真管理', '視覚的', '把握', '食材管理'] },
  { title: '食材リスト管理術！在庫を把握する方法', slug: 'shokuzai-list-kanri', cost: '0円', time: '15分', keywords: ['食材 リスト管理', '在庫', '把握', '食材管理'] },
  { title: '食材期限管理術！賞味期限を管理するコツ', slug: 'shokuzai-kigen-kanri', cost: '0円', time: '10分', keywords: ['食材 期限管理', '賞味期限', '管理', '食材管理'] },
  { title: '食材購入計画術！無駄買いを防ぐ方法', slug: 'shokuzai-kounyuu-keikaku', cost: '0円', time: '15分', keywords: ['食材 購入計画', '無駄買い', '節約', '食材管理'] },
  { title: '食材消費計画術！使い切る方法', slug: 'shokuzai-shouhi-keikaku', cost: '0円', time: '15分', keywords: ['食材 消費計画', '使い切り', '無駄削減', '食材管理'] },
  { title: '食材メモ管理術！記録する方法', slug: 'shokuzai-memo-kanri', cost: '0円', time: '10分', keywords: ['食材 メモ管理', '記録', '把握', '食材管理'] },
  { title: '食材共有管理術！家族で管理する方法', slug: 'shokuzai-kyouyuu-kanri', cost: '0円', time: '15分', keywords: ['食材 共有管理', '家族', '管理', '食材管理'] },
  { title: '食材定期チェック術！週1回確認する方法', slug: 'shokuzai-teiki-check', cost: '0円', time: '10分', keywords: ['食材 定期チェック', '週1回', '確認', '食材管理'] },
  { title: '食材優先順位管理術！使う順番を決める方法', slug: 'shokuzai-yuusei-junban', cost: '0円', time: '10分', keywords: ['食材 優先順位', '使う順番', '管理', '食材管理'] },
  { title: '食材期限アラート術！通知を受け取る方法', slug: 'shokuzai-kigen-alert', cost: '0円', time: '5分', keywords: ['食材 期限アラート', '通知', 'ふどろす', '食材管理'] },
  { title: '食材バーコード管理術！簡単登録する方法', slug: 'shokuzai-barcode-kanri', cost: '0円', time: '5分', keywords: ['食材 バーコード', '簡単登録', 'ふどろす', '食材管理'] },
  { title: '食材検索機能術！素早く見つける方法', slug: 'shokuzai-search-kinou', cost: '0円', time: '5分', keywords: ['食材 検索', '素早く', 'ふどろす', '食材管理'] },
  { title: '食材統計管理術！消費傾向を把握する方法', slug: 'shokuzai-toukei-kanri', cost: '0円', time: '10分', keywords: ['食材 統計', '消費傾向', '把握', '食材管理'] }
];

// フードロス削減系の記事（30個）
const foodlossTemplates = [
  { title: 'フードロス削減術！家庭でできる10の方法', slug: 'foodloss-sakugen-10houhou', cost: '0円', time: '30分', keywords: ['フードロス削減', '家庭', '10の方法', '無駄削減'] },
  { title: '賞味期限と消費期限の違い！正しく理解する方法', slug: 'shoumi-shouhi-kigen-chigai', cost: '0円', time: '10分', keywords: ['賞味期限', '消費期限', '違い', '理解'] },
  { title: 'フードロス削減アプリ！ふどろすの活用法', slug: 'foodloss-app-katsuyou', cost: '0円', time: '10分', keywords: ['フードロス削減', 'アプリ', 'ふどろす', '活用'] },
  { title: '食材使い切り術！無駄を出さない方法', slug: 'shokuzai-tsukaikiri-jutsu', cost: '0円', time: '20分', keywords: ['食材 使い切り', '無駄削減', 'フードロス削減', '活用'] },
  { title: '残り物活用術！リメイクレシピ集', slug: 'nokorimono-katsuyou-jutsu', cost: '0円', time: '25分', keywords: ['残り物 活用', 'リメイク', 'フードロス削減', 'レシピ'] },
  { title: '野菜くず活用術！無駄を出さない方法', slug: 'yasai-kuzu-katsuyou', cost: '0円', time: '15分', keywords: ['野菜くず 活用', '無駄削減', 'フードロス削減', '活用'] },
  { title: '皮まで食べる術！食材を無駄にしない方法', slug: 'kawa-made-taberu', cost: '0円', time: '20分', keywords: ['皮 食べる', '無駄削減', 'フードロス削減', '活用'] },
  { title: '種まで食べる術！食材を無駄にしない方法', slug: 'tane-made-taberu', cost: '0円', time: '15分', keywords: ['種 食べる', '無駄削減', 'フードロス削減', '活用'] },
  { title: '茎まで食べる術！食材を無駄にしない方法', slug: 'kuki-made-taberu', cost: '0円', time: '15分', keywords: ['茎 食べる', '無駄削減', 'フードロス削減', '活用'] },
  { title: '葉まで食べる術！食材を無駄にしない方法', slug: 'ha-made-taberu', cost: '0円', time: '15分', keywords: ['葉 食べる', '無駄削減', 'フードロス削減', '活用'] },
  { title: 'コンポスト活用術！生ごみを減らす方法', slug: 'compost-katsuyou-jutsu', cost: '0円', time: '30分', keywords: ['コンポスト', '生ごみ 減らす', 'フードロス削減', '環境'] },
  { title: '生ごみ削減術！家庭でできる方法', slug: 'namagomi-sakugen-jutsu', cost: '0円', time: '20分', keywords: ['生ごみ 削減', '家庭', 'フードロス削減', '無駄削減'] },
  { title: '食品ロス統計！日本の現状を知る', slug: 'shokuhin-loss-toukei', cost: '0円', time: '10分', keywords: ['食品ロス', '統計', '日本の現状', 'フードロス削減'] },
  { title: 'フードロス削減効果！環境への影響', slug: 'foodloss-sakugen-kouka', cost: '0円', time: '10分', keywords: ['フードロス削減', '効果', '環境', '影響'] },
  { title: 'フードロス削減目標！2030年までに半減', slug: 'foodloss-sakugen-mokuhyou', cost: '0円', time: '10分', keywords: ['フードロス削減', '目標', '2030年', '半減'] },
  { title: 'フードロス削減運動！みんなで取り組む', slug: 'foodloss-sakugen-undou', cost: '0円', time: '15分', keywords: ['フードロス削減', '運動', '取り組み', '社会'] },
  { title: 'フードロス削減教育！子供に教える方法', slug: 'foodloss-sakugen-kyouiku', cost: '0円', time: '20分', keywords: ['フードロス削減', '教育', '子供', '教える'] },
  { title: 'フードロス削減イベント！参加する方法', slug: 'foodloss-sakugen-event', cost: '0円', time: '15分', keywords: ['フードロス削減', 'イベント', '参加', '社会'] },
  { title: 'フードロス削減団体！支援する方法', slug: 'foodloss-sakugen-dantai', cost: '0円', time: '15分', keywords: ['フードロス削減', '団体', '支援', '社会'] },
  { title: 'フードロス削減法！法律を知る', slug: 'foodloss-sakugen-hou', cost: '0円', time: '15分', keywords: ['フードロス削減', '法律', '知る', '社会'] },
  { title: 'フードロス削減企業！取り組む企業を知る', slug: 'foodloss-sakugen-kigyou', cost: '0円', time: '15分', keywords: ['フードロス削減', '企業', '取り組み', '社会'] },
  { title: 'フードロス削減技術！最新技術を知る', slug: 'foodloss-sakugen-gijutsu', cost: '0円', time: '15分', keywords: ['フードロス削減', '技術', '最新', '社会'] },
  { title: 'フードロス削減研究！最新研究を知る', slug: 'foodloss-sakugen-kenkyuu', cost: '0円', time: '15分', keywords: ['フードロス削減', '研究', '最新', '社会'] },
  { title: 'フードロス削減ニュース！最新情報を知る', slug: 'foodloss-sakugen-news', cost: '0円', time: '10分', keywords: ['フードロス削減', 'ニュース', '最新情報', '社会'] },
  { title: 'フードロス削減SNS！情報共有する方法', slug: 'foodloss-sakugen-sns', cost: '0円', time: '10分', keywords: ['フードロス削減', 'SNS', '情報共有', '社会'] },
  { title: 'フードロス削減ブログ！情報発信する方法', slug: 'foodloss-sakugen-blog', cost: '0円', time: '15分', keywords: ['フードロス削減', 'ブログ', '情報発信', '社会'] },
  { title: 'フードロス削減YouTube！動画で学ぶ', slug: 'foodloss-sakugen-youtube', cost: '0円', time: '15分', keywords: ['フードロス削減', 'YouTube', '動画', '学習'] },
  { title: 'フードロス削減本！おすすめ書籍', slug: 'foodloss-sakugen-hon', cost: '0円', time: '10分', keywords: ['フードロス削減', '本', '書籍', '学習'] },
  { title: 'フードロス削減セミナー！参加する方法', slug: 'foodloss-sakugen-seminar', cost: '0円', time: '15分', keywords: ['フードロス削減', 'セミナー', '参加', '学習'] },
  { title: 'フードロス削減資格！取得する方法', slug: 'foodloss-sakugen-shikaku', cost: '0円', time: '20分', keywords: ['フードロス削減', '資格', '取得', '学習'] }
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

  if (template.title.includes('卵')) {
    baseIngredients.unshift('卵 2個');
  }
  if (template.title.includes('もやし')) {
    baseIngredients.unshift('もやし 1袋');
  }
  if (template.title.includes('豆腐')) {
    baseIngredients.unshift('豆腐 1丁');
  }
  if (template.title.includes('鶏')) {
    baseIngredients.unshift('鶏もも肉 100g');
  }
  if (template.title.includes('ツナ')) {
    baseIngredients.unshift('ツナ缶 1缶');
  }

  return baseIngredients.slice(0, 6);
}

function generateSteps(template, ingredients) {
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
  }

  return steps;
}

function generateTips(template) {
  const tips = [
    'ふどろすで冷蔵庫の中身を確認してから作ると、無駄なく使えます！',
    '給料日前の節約にも最適です。',
    '作り置きしておけば、忙しい日も助かります。'
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
