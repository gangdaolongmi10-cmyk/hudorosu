'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

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
    <div className="puroseka-page">
      {/* ヒーローセクション */}
      <section className="puroseka-hero">
        <div className="puroseka-hero-content">
          <h1 className="puroseka-title">プロジェクトセカイ</h1>
          <p className="puroseka-subtitle">キャラクターの好きな食べ物・嫌いな食べ物を検索</p>
          <p className="puroseka-description">
            プロジェクトセカイの全キャラクターの好みの食べ物を検索できます。<br />
            レシピ提案の参考にどうぞ！
          </p>
        </div>
      </section>

      <div className="puroseka-container">
        {/* フィルターセクション */}
        <section className="puroseka-filters">
          <div className="filter-card">
            <h2 className="filter-title">検索・フィルター</h2>
            <div className="filter-grid">
              {/* ユニット選択 */}
              <div className="filter-item">
                <label htmlFor="unit-select" className="filter-label">
                  <svg className="filter-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                  ユニット
                </label>
                <select
                  id="unit-select"
                  value={selectedUnit}
                  onChange={(e) => {
                    setSelectedUnit(e.target.value)
                    setSelectedCharacter('all')
                  }}
                  className="filter-select"
                >
                  <option value="all">すべてのユニット</option>
                  {units.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>

              {/* キャラクター選択 */}
              <div className="filter-item">
                <label htmlFor="character-select" className="filter-label">
                  <svg className="filter-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  キャラクター
                </label>
                <select
                  id="character-select"
                  value={selectedCharacter}
                  onChange={(e) => setSelectedCharacter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">すべてのキャラクター</option>
                  {availableCharacters.map((char) => (
                    <option key={char.id} value={char.id}>
                      {char.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 検索 */}
              <div className="filter-item filter-item-full">
                <label htmlFor="search-input" className="filter-label">
                  <svg className="filter-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  食べ物で検索
                </label>
                <input
                  id="search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="例: おにぎり、カレー、ケーキ..."
                  className="filter-input"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 結果表示 */}
        <section className="puroseka-results">
          <div className="results-header">
            <h2 className="results-title">
              {filteredCharacters.length > 0 ? (
                <>
                  <span className="results-count">{filteredCharacters.length}</span>件のキャラクターが見つかりました
                </>
              ) : (
                '該当するキャラクターが見つかりませんでした'
              )}
            </h2>
          </div>

          {filteredCharacters.length > 0 ? (
            <div className="character-grid">
              {filteredCharacters.map((char) => (
                <div key={char.id} className="character-card">
                  <div className="character-header">
                    <div className="character-avatar">
                      <span className="character-initial">{char.name.charAt(0)}</span>
                    </div>
                    <div className="character-info">
                      <h3 className="character-name">{char.name}</h3>
                      <p className="character-unit">{char.unit}</p>
                    </div>
                  </div>

                  <div className="character-content">
                    {/* 好きな食べ物 */}
                    <div className="food-section">
                      <div className="food-section-header">
                        <svg className="food-icon favorite" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        <span className="food-section-title">好きな食べ物</span>
                      </div>
                      <div className="food-tags">
                        {char.favorite_foods.length > 0 ? (
                          char.favorite_foods.map((food, index) => (
                            <span key={index} className="food-tag favorite-tag">
                              {food}
                            </span>
                          ))
                        ) : (
                          <span className="food-tag-empty">なし</span>
                        )}
                      </div>
                    </div>

                    {/* 嫌いな食べ物 */}
                    <div className="food-section">
                      <div className="food-section-header">
                        <svg className="food-icon disliked" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        <span className="food-section-title">嫌いな食べ物</span>
                      </div>
                      <div className="food-tags">
                        {char.disliked_foods.length > 0 ? (
                          char.disliked_foods.map((food, index) => (
                            <span key={index} className="food-tag disliked-tag">
                              {food}
                            </span>
                          ))
                        ) : (
                          <span className="food-tag-empty">なし</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <svg className="no-results-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <p className="no-results-text">該当するキャラクターが見つかりませんでした</p>
              <p className="no-results-hint">検索条件を変更してお試しください</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
