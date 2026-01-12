# ふどろす LP

Next.jsで構築されたランディングページとブログ管理システム

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS + カスタムCSS (`index.css`)
- **リンター**: ESLint

## セットアップ

### 依存関係のインストール

```bash
# ルートディレクトリから
npm run install:all

# または、このディレクトリで直接
cd packages/lp
npm install
```

## 開発

### 開発サーバーの起動

```bash
# ルートディレクトリから
npm run dev:lp

# または、このディレクトリで直接
cd packages/lp
npm run dev
```

開発サーバーは `http://localhost:3000` で起動します。

### ビルド

```bash
# ルートディレクトリから
npm run build:lp

# または、このディレクトリで直接
cd packages/lp
npm run build
```

### 本番環境での起動

```bash
npm run build
npm start
```

## プロジェクト構造

```
packages/lp/
├── app/                    # Next.js App Router
│   ├── admin/              # 管理画面
│   │   ├── login/          # ログイン画面
│   │   ├── dashboard/      # ダッシュボード
│   │   ├── blog/           # ブログ管理
│   │   └── layout-editor/  # 共通レイアウト編集
│   ├── api/                # API Routes
│   │   ├── admin/          # 管理用API
│   │   └── revalidate/     # ISR再検証API
│   ├── blog/               # ブログ記事表示
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # トップページ
│   └── globals.css         # グローバルスタイル
├── components/             # Reactコンポーネント
├── contexts/               # React Context
├── config/                 # 設定ファイル
├── utils/                  # ユーティリティ関数
├── public/                 # 静的ファイル
│   └── index.css           # CSSファイル（静的配信）
├── blog/                   # ブログ記事保存先
│   ├── *.html              # ブログ記事
│   ├── _header.html        # 共通ヘッダー
│   ├── _footer.html        # 共通フッター
│   └── _meta.html          # 共通Meta
├── package.json
├── tsconfig.json
├── next.config.js
└── vercel.json             # Vercel設定
```

## 環境変数

`.env.local`ファイルを作成して、以下の環境変数を設定してください：

```bash
# ISR再検証設定
REVALIDATE_SECRET=your-revalidate-secret-token

# サイトURL設定
NEXT_PUBLIC_BASE_URL=https://www.hudorosu.com

# 環境設定
NODE_ENV=development
```

詳細は `ENV.example` を参照してください。

## デプロイ

### Vercel

#### 方法1: Vercelダッシュボードから

1. [Vercel](https://vercel.com) にログイン
2. 「Add New...」→「Project」をクリック
3. GitHubリポジトリを選択
4. 以下の設定を行う：
   - **Root Directory**: `packages/lp`
   - **Framework Preset**: `Next.js`
   - **Build Command**: `npm run build`（自動検出される）
   - **Output Directory**: `.next`（自動検出される）
   - **Install Command**: `npm install`（自動検出される）
5. **Environment Variables** を設定：
   - `REVALIDATE_SECRET`: 再検証トークン（`openssl rand -base64 32`で生成）
   - `NEXT_PUBLIC_BASE_URL`: デプロイ後のURL（例: `https://your-project.vercel.app`）
6. 「Deploy」をクリック

#### 方法2: Vercel CLIから

```bash
# Vercel CLIをインストール（初回のみ）
npm i -g vercel

# プロジェクトルートから
cd packages/lp

# デプロイ
vercel

# 本番環境にデプロイ
vercel --prod
```

#### 方法3: GitHub連携

1. VercelダッシュボードでGitHubリポジトリを連携
2. 上記の設定（Root Directory、Environment Variables）を行う
3. プッシュ時に自動デプロイ

### 環境変数の設定

Vercelダッシュボードで以下の環境変数を設定してください：

- `REVALIDATE_SECRET`: ISR再検証トークン
  - 生成方法: `openssl rand -base64 32`
- `NEXT_PUBLIC_BASE_URL`: サイトのベースURL
  - 例: `https://www.hudorosu.com` または `https://your-project.vercel.app`

## 機能

### ランディングページ

- トップページ（`/`）
- レスポンシブデザイン
- SEO最適化（メタタグ、sitemap.xml）

### ブログ機能

- ブログ記事の表示（`/blog/[slug]`）
- ISR（Incremental Static Regeneration）対応
- 自動sitemap.xml更新

### 管理画面（`/admin`）

- ログイン機能（固定認証情報）
- ブログ記事の作成・編集・削除
- 共通レイアウト（ヘッダー、フッター、Meta）の編集
- リアルタイムプレビュー（PC/SP対応）

### ISR（Incremental Static Regeneration）

ブログ記事の作成・更新・削除時に、自動的にVercelの再検証APIを呼び出してISRを実行します。

## 注意事項

- ブログ記事は`packages/lp/blog`ディレクトリに保存されます
- 共通レイアウトファイル（`_header.html`, `_footer.html`, `_meta.html`）も同じディレクトリに保存されます
- `index.css`は`public/index.css`として静的ファイルとして配信されます
- 管理画面の認証情報は固定（`lpadmin@example.com` / `password0`）
