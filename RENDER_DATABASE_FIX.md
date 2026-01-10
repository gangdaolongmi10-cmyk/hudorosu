# Render データベース接続エラー修正ガイド

## ❌ エラー: "Error parsing url: undefined"

このエラーは、`DATABASE_URL`環境変数が設定されていない場合に発生します。

## 🔧 解決方法

### ステップ1: Renderダッシュボードで環境変数を設定（必須）

1. Renderダッシュボードでサービスを選択
2. 「Environment」タブを開く
3. 「+ Add Environment Variable」をクリック
4. 以下を追加：

**変数名**: `DATABASE_URL`  
**値**: Supabaseの接続文字列

例：
```
postgresql://postgres:your-password@db.xxx.supabase.co:5432/postgres
```

### ステップ2: Supabaseから接続文字列を取得

1. [Supabase](https://supabase.com) にログイン
2. プロジェクトを選択
3. 「Settings」→「Database」を開く
4. 「Connection string」セクションで「URI」をコピー
5. `[YOUR-PASSWORD]`の部分を実際のパスワードに置き換え

### ステップ3: 再デプロイ

環境変数を設定した後、Renderで再デプロイを実行してください。

## 📝 設定したファイル

- `app/config/config.js` - Sequelize CLI用の設定ファイル（環境変数を読み込む）
- `app/package.json` - `dotenv`パッケージを追加

## ⚠️ 重要

**`DATABASE_URL`環境変数は必ずRenderダッシュボードで設定してください。**

`config.js`は環境変数を読み込むための補助的な役割です。本番環境では、Renderダッシュボードで設定した環境変数が使用されます。

## 🔍 確認方法

1. Renderダッシュボード → 「Environment」タブ
2. `DATABASE_URL`が表示されているか確認
3. 値が正しい形式か確認（`postgresql://...`で始まる）
