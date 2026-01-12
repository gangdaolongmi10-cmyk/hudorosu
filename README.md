# Hudorosu Backend

Express + TypeScript バックエンド、Vite + React フロントエンド、React Native + Expo Go モバイルアプリの統合プロジェクト

## プロジェクト構成

```
hudorosu_backend/
├── packages/
│   ├── backend/      # バックエンド (Express + TypeScript)
│   ├── frontend/     # 管理画面 (Vite + React + TypeScript)
│   ├── web/          # 一般ユーザー向けWEBサイト (HTML/CSS/JavaScript)
│   └── mobile/       # モバイルアプリ (React Native + Expo Go)
├── shared/           # 共有モジュール
├── docker/           # Docker設定ファイル（PostgreSQL用）
└── docker-compose.yml # データベースのみのDocker Compose設定
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
cd packages/backend && npm install

# 管理画面（フロントエンド）
cd packages/frontend && npm install

# 一般ユーザー向けWEBサイト
cd packages/web && npm install

# モバイルアプリ
cd packages/mobile && npm install

# 共有モジュール
cd shared && npm install
```

### 2. 開発サーバーの起動

#### 方法1: 統合スクリプト（推奨）

```bash
# ルートディレクトリから
npm run dev
```

これにより、バックエンド（ポート3000）、管理画面（ポート5173）、一般ユーザー向けWEBサイト（ポート5174）が同時に起動します。

#### 方法2: 個別に起動

```bash
# バックエンド（ターミナル1）
npm run dev:backend

# 管理画面（ターミナル2）
npm run dev:frontend

# 一般ユーザー向けWEBサイト（ターミナル3）
npm run dev:web

# モバイルアプリ（ターミナル4）
npm run dev:mobile
```

### 3. データベースのセットアップ

#### 3-1. データベースの起動

```bash
# データベースコンテナを起動
docker-compose up -d db

# データベースGUI（Adminer）も起動する場合
docker-compose up -d
```

#### 3-2. 環境変数の設定（オプション）

デフォルト値で動作しますが、カスタマイズする場合はルートディレクトリに`.env`ファイルを作成：

```bash
DB_USER=user
DB_PASSWORD=password
DB_NAME=mydb
DB_HOST=localhost
NODE_ENV=development
```

#### 3-3. データベースマイグレーション

データベースが起動したら、以下のコマンドでマイグレーションを実行：

```bash
# バックエンドディレクトリで
cd packages/backend
npm run migrate
```

データベース接続情報：
- **ホスト**: localhost
- **ポート**: 5432
- **ユーザー名**: user（デフォルト、.envファイルで変更可能）
- **パスワード**: password（デフォルト、.envファイルで変更可能）
- **データベース名**: mydb（デフォルト、.envファイルで変更可能）
- **データベースGUI（Adminer）**: http://localhost:8080

## アクセス

- **管理画面**: http://localhost:5173
- **一般ユーザー向けWEBサイト**: http://localhost:5174
- **バックエンドAPI**: http://localhost:3000
- **APIエンドポイント**: 
  - 管理画面: http://localhost:5173/api/* (Viteのプロキシ経由)
  - WEBサイト: http://localhost:5174/api/* (Viteのプロキシ経由)

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

### 管理画面（フロントエンド）
- React 18
- TypeScript
- Vite 5
- Tailwind CSS

### 一般ユーザー向けWEBサイト
- HTML5
- CSS3
- JavaScript (Vanilla)
- レスポンシブデザイン

### モバイルアプリ
- React Native
- Expo Go
- TypeScript
- React Navigation
- AsyncStorage

## 開発

### バックエンドの追加ルート

`packages/backend/src/routes/` に新しいルートファイルを追加し、`packages/backend/src/index.ts` で登録してください。

### 管理画面のコンポーネント

`packages/frontend/src/` にReactコンポーネントを追加してください。

### 一般ユーザー向けWEBサイトの開発

`packages/web/src/` にReactコンポーネントを追加してください。ライティングページは `packages/web/src/pages/WritingPage.tsx` を編集してください。詳細は `packages/web/README.md` を参照してください。

### モバイルアプリの開発

`packages/mobile/src/screens/` に新しい画面を追加してください。詳細は `packages/mobile/README.md` を参照してください。

## 開発環境の要件

- **Node.js**: 20.0.0以上（グローバルにインストール）
- **npm**: 9.0.0以上（グローバルにインストール）
- **Docker**: データベースのみ（PostgreSQL 15）
- **Docker Compose**: データベースコンテナの管理用

## データベース接続

開発環境では、Docker Composeで起動したPostgreSQLデータベースに接続します：

- **接続文字列**: `postgresql://user:password@localhost:5432/mydb`
- **設定ファイル**: `packages/backend/config/config.js`

