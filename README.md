# Hudorosu Backend

Express + TypeScript バックエンド、Vite + React フロントエンド、React Native + Expo Go モバイルアプリの統合プロジェクト

## プロジェクト構成

```
hudorosu_backend/
├── app/              # バックエンド (Express + TypeScript)
├── frontend/         # フロントエンド (Vite + React + TypeScript)
├── mobile/           # モバイルアプリ (React Native + Expo Go)
├── docker/           # Docker設定ファイル
└── docker-compose.yml
```

## セットアップ

### 1. 依存関係のインストール

```bash
# ルートディレクトリで全パッケージをインストール
npm run install:all
```

または、個別にインストール:

```bash
# バックエンド
cd app && npm install

# フロントエンド
cd frontend && npm install

# モバイルアプリ
cd mobile && npm install
```

### 2. 開発サーバーの起動

#### 方法1: 統合スクリプト（推奨）

```bash
# ルートディレクトリから
npm run dev
```

これにより、バックエンド（ポート3000）とフロントエンド（ポート5173）が同時に起動します。

#### 方法2: 個別に起動

```bash
# バックエンド（ターミナル1）
npm run dev:backend

# フロントエンド（ターミナル2）
npm run dev:frontend

# モバイルアプリ（ターミナル3）
npm run dev:mobile
```

### 3. データベースマイグレーション

家計簿機能用のデータベーステーブルを作成するには、以下のコマンドを実行してください：

```bash
# バックエンドディレクトリに移動
cd app

# マイグレーションを実行
npm run migrate
```

これにより、以下のテーブルが作成されます：
- `transaction_categories` - 記録カテゴリテーブル
- `transactions` - 記録テーブル

### 4. Docker Composeを使用

```bash
docker-compose up
```

## アクセス

- **フロントエンド**: http://localhost:5173
- **バックエンドAPI**: http://localhost:3000
- **APIエンドポイント**: http://localhost:5173/api/* (Viteのプロキシ経由)

## APIエンドポイント

- `GET /api/health` - ヘルスチェック
- `GET /api/*` - ユーザールート
- `GET /api/admin/*` - 管理者ルート

## ビルド

```bash
# 本番用ビルド
npm run build
```

## 技術スタック

### バックエンド
- Express.js
- TypeScript
- Node.js

### フロントエンド
- React 18
- TypeScript
- Vite 5
- CSS Modules

### モバイルアプリ
- React Native
- Expo Go
- TypeScript
- React Navigation
- AsyncStorage

## 開発

### バックエンドの追加ルート

`app/src/routes/` に新しいルートファイルを追加し、`app/src/index.ts` で登録してください。

### フロントエンドのコンポーネント

`frontend/src/` にReactコンポーネントを追加してください。

### モバイルアプリの開発

`mobile/src/screens/` に新しい画面を追加してください。詳細は `mobile/README.md` を参照してください。

