'use client'

import { useState, useMemo } from 'react'

interface Character {
  id: string
  name: string
  unit: string
  favorite_foods: string[]
  disliked_foods: string[]
}

const purosekaData = {
  characters: [
    {
      id: "ichika",
      name: "星乃一歌",
      unit: "Leo/need",
      favorite_foods: ["おにぎり", "お茶", "みかん"],
      disliked_foods: ["辛いもの", "苦いもの"]
    },
    {
      id: "saki",
      name: "天馬咲希",
      unit: "Leo/need",
      favorite_foods: ["パンケーキ", "いちご", "ホットケーキ"],
      disliked_foods: ["にんじん", "ピーマン"]
    },
    {
      id: "honami",
      name: "望月穂波",
      unit: "Leo/need",
      favorite_foods: ["お好み焼き", "たこ焼き", "おでん"],
      disliked_foods: ["生魚", "貝類"]
    },
    {
      id: "shiho",
      name: "日野森志歩",
      unit: "Leo/need",
      favorite_foods: ["カレー", "ハンバーグ", "ラーメン"],
      disliked_foods: ["甘いもの", "お菓子"]
    },
    {
      id: "minori",
      name: "花里みのり",
      unit: "MORE MORE JUMP!",
      favorite_foods: ["おにぎり", "お茶", "和菓子"],
      disliked_foods: ["辛いもの", "刺激の強いもの"]
    },
    {
      id: "haruka",
      name: "桐谷遥",
      unit: "MORE MORE JUMP!",
      favorite_foods: ["サラダ", "フルーツ", "ヨーグルト"],
      disliked_foods: ["揚げ物", "脂っこいもの"]
    },
    {
      id: "airi",
      name: "桃井愛莉",
      unit: "MORE MORE JUMP!",
      favorite_foods: ["ケーキ", "チョコレート", "アイスクリーム"],
      disliked_foods: ["苦いもの", "酸っぱいもの"]
    },
    {
      id: "shizuku",
      name: "日野森雫",
      unit: "MORE MORE JUMP!",
      favorite_foods: ["お茶", "和菓子", "お寿司"],
      disliked_foods: ["辛いもの", "刺激の強いもの"]
    },
    {
      id: "kohane",
      name: "小豆沢こはね",
      unit: "Vivid BAD SQUAD",
      favorite_foods: ["ハンバーガー", "フライドポテト", "コーラ"],
      disliked_foods: ["野菜", "健康的なもの"]
    },
    {
      id: "an",
      name: "東雲彰人",
      unit: "Vivid BAD SQUAD",
      favorite_foods: ["ラーメン", "カレー", "焼肉"],
      disliked_foods: ["甘いもの", "デザート"]
    },
    {
      id: "akito",
      name: "青柳冬弥",
      unit: "Vivid BAD SQUAD",
      favorite_foods: ["コーヒー", "パン", "サンドイッチ"],
      disliked_foods: ["甘いもの", "お菓子"]
    },
    {
      id: "toya",
      name: "初音ミク",
      unit: "Vivid BAD SQUAD",
      favorite_foods: ["お茶", "和菓子", "お寿司"],
      disliked_foods: ["辛いもの", "刺激の強いもの"]
    },
    {
      id: "tsukasa",
      name: "天馬司",
      unit: "Wonderlands×Showtime",
      favorite_foods: ["ハンバーグ", "オムライス", "カレー"],
      disliked_foods: ["苦いもの", "酸っぱいもの"]
    },
    {
      id: "emu",
      name: "鳳えむ",
      unit: "Wonderlands×Showtime",
      favorite_foods: ["ポップコーン", "キャンディ", "アイスクリーム"],
      disliked_foods: ["苦いもの", "辛いもの"]
    },
    {
      id: "nene",
      name: "草薙寧々",
      unit: "Wonderlands×Showtime",
      favorite_foods: ["おにぎり", "お茶", "和菓子"],
      disliked_foods: ["辛いもの", "刺激の強いもの"]
    },
    {
      id: "rui",
      name: "神代類",
      unit: "Wonderlands×Showtime",
      favorite_foods: ["ラーメン", "カレー", "焼きそば"],
      disliked_foods: ["甘いもの", "デザート"]
    },
    {
      id: "kanade",
      name: "宵崎奏",
      unit: "25時、ナイトコードで。",
      favorite_foods: ["カップラーメン", "おにぎり", "お茶"],
      disliked_foods: ["健康的なもの", "野菜"]
    },
    {
      id: "mafuyu",
      name: "朝比奈まふゆ",
      unit: "25時、ナイトコードで。",
      favorite_foods: ["おにぎり", "お茶", "和菓子"],
      disliked_foods: ["辛いもの", "刺激の強いもの"]
    },
    {
      id: "ena",
      name: "東雲絵名",
      unit: "25時、ナイトコードで。",
      favorite_foods: ["ケーキ", "チョコレート", "アイスクリーム"],
      disliked_foods: ["苦いもの", "酸っぱいもの"]
    },
    {
      id: "mizuki",
      name: "暁山瑞希",
      unit: "25時、ナイトコードで。",
      favorite_foods: ["パンケーキ", "いちご", "ホットケーキ"],
      disliked_foods: ["辛いもの", "刺激の強いもの"]
    }
  ] as Character[],
  units: [
    "Leo/need",
    "MORE MORE JUMP!",
    "Vivid BAD SQUAD",
    "Wonderlands×Showtime",
    "25時、ナイトコードで。"
  ]
}

export default function PurosekaPage() {
  const [selectedUnit, setSelectedUnit] = useState<string>('all')
  const [selectedCharacter, setSelectedCharacter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const characters = purosekaData.characters
  const units = purosekaData.units

  // フィルタリング処理
  const filteredCharacters = useMemo(() => {
    let filtered = characters

    // ユニットで絞り込み
    if (selectedUnit !== 'all') {
      filtered = filtered.filter((char) => char.unit === selectedUnit)
    }

    // キャラクターで絞り込み
    if (selectedCharacter !== 'all') {
      filtered = filtered.filter((char) => char.id === selectedCharacter)
    }

    // 検索クエリで絞り込み（食べ物のみ）
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((char) => {
        const matchesFavorite = char.favorite_foods.some((food) =>
          food.toLowerCase().includes(query)
        )
        const matchesDisliked = char.disliked_foods.some((food) =>
          food.toLowerCase().includes(query)
        )
        return matchesFavorite || matchesDisliked
      })
    }

    return filtered
  }, [selectedUnit, selectedCharacter, searchQuery, characters])

  // 選択されたユニットのキャラクター一覧を取得
  const availableCharacters = useMemo(() => {
    if (selectedUnit === 'all') {
      return characters
    }
    return characters.filter((char) => char.unit === selectedUnit)
  }, [selectedUnit, characters])

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            プロジェクトセカイ
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-2">
            キャラクターの好きな食べ物・嫌いな食べ物
          </p>
        </div>

        {/* フィルター */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* ユニット選択 */}
            <div>
              <label
                htmlFor="unit-select"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                ユニット
              </label>
              <select
                id="unit-select"
                value={selectedUnit}
                onChange={(e) => {
                  setSelectedUnit(e.target.value)
                  setSelectedCharacter('all') // ユニット変更時はキャラクター選択をリセット
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
              >
                <option value="all">すべて</option>
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>

            {/* キャラクター選択 */}
            <div>
              <label
                htmlFor="character-select"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                キャラクター
              </label>
              <select
                id="character-select"
                value={selectedCharacter}
                onChange={(e) => setSelectedCharacter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
              >
                <option value="all">すべて</option>
                {availableCharacters.map((char) => (
                  <option key={char.id} value={char.id}>
                    {char.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 検索 */}
            <div>
              <label
                htmlFor="search-input"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                検索
              </label>
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="名前や食べ物で検索..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
              />
            </div>
          </div>
        </div>

        {/* 結果表示 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredCharacters.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">該当するキャラクターが見つかりませんでした</p>
            </div>
          ) : (
            filteredCharacters.map((char) => (
              <div
                key={char.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                {/* キャラクター情報 */}
                <div className="p-4 sm:p-6">
                  <div className="mb-4">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                      {char.name}
                    </h3>
                    <p className="text-sm sm:text-base text-purple-600 font-medium">
                      {char.unit}
                    </p>
                  </div>

                  {/* 好きな食べ物 */}
                  <div className="mb-4">
                    <h4 className="text-sm sm:text-base font-semibold text-green-700 mb-2 flex items-center">
                      <span className="mr-2">❤️</span>
                      好きな食べ物
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {char.favorite_foods.length > 0 ? (
                        char.favorite_foods.map((food, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 sm:px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm font-medium"
                          >
                            {food}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-xs sm:text-sm">なし</span>
                      )}
                    </div>
                  </div>

                  {/* 嫌いな食べ物 */}
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-red-700 mb-2 flex items-center">
                      <span className="mr-2">💔</span>
                      嫌いな食べ物
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {char.disliked_foods.length > 0 ? (
                        char.disliked_foods.map((food, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 sm:px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs sm:text-sm font-medium"
                          >
                            {food}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-xs sm:text-sm">なし</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 結果数表示 */}
        <div className="mt-6 text-center text-sm sm:text-base text-gray-600">
          {filteredCharacters.length}件のキャラクターが見つかりました
        </div>
    </div>
  )
}
