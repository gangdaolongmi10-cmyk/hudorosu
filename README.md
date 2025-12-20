# Hudorosu Backend

Express + TypeScript バックエンドと Vite + React フロントエンドの統合プロジェクト

## プロジェクト構成

```
hudorosu_backend/
├── app/              # バックエンド (Express + TypeScript)
├── frontend/         # フロントエンド (Vite + React + TypeScript)
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
```

### 3. Docker Composeを使用

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

## 開発

### バックエンドの追加ルート

`app/src/routes/` に新しいルートファイルを追加し、`app/src/index.ts` で登録してください。

### フロントエンドのコンポーネント

`frontend/src/` にReactコンポーネントを追加してください。

