# ふどろす LP

ふどろすのランディングページ（Next.js）

## プロジェクト構造

```
packages/lp/
├── app/                    # Next.js App Router
│   ├── admin/              # 管理画面（共通レイアウト編集用）
│   ├── api/                # API Routes
│   ├── blog/               # ブログ記事表示
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # トップページ
│   └── sitemap.ts          # 動的サイトマップ生成
├── blog/                   # ブログ記事保存先（静的ファイル）
│   ├── *.html              # ブログ記事
│   ├── _header.html        # 共通ヘッダー
│   ├── _footer.html        # 共通フッター
│   └── _meta.html          # 共通Meta
├── components/              # Reactコンポーネント
├── config/                 # 設定ファイル
├── contexts/               # React Context
├── utils/                  # ユーティリティ関数
├── public/                 # 静的ファイル
│   └── index.css           # CSSファイル（静的配信）
├── package.json
├── tsconfig.json
├── next.config.js
└── vercel.json             # Vercel設定
```

## ブログ記事の管理

### 静的ファイル方式

ブログ記事は、**直接`packages/lp/blog/`ディレクトリにHTMLファイルとして配置**してください。

#### ブログ記事の作成

1. `packages/lp/blog/`ディレクトリに新しいHTMLファイルを作成
   ```bash
   # 例: packages/lp/blog/my-article.html
   ```

2. HTMLファイルの内容を記述
   ```html
   <h1>記事タイトル</h1>
   <p>記事の内容...</p>
   ```

3. Gitでコミット・プッシュ
   ```bash
   git add packages/lp/blog/my-article.html
   git commit -m "Add blog article: my-article"
   git push
   ```

4. Vercelのデプロイ時に自動的に反映されます

#### ブログ記事の編集

1. `packages/lp/blog/`ディレクトリのHTMLファイルを直接編集
2. Gitでコミット・プッシュ
3. Vercelのデプロイ時に自動的に反映されます

#### ブログ記事の削除

1. `packages/lp/blog/`ディレクトリのHTMLファイルを削除
2. Gitでコミット・プッシュ
3. Vercelのデプロイ時に自動的に反映されます

### 共通レイアウト

ブログ記事には、以下の共通レイアウトが自動的に適用されます：

- **ヘッダー**: `packages/lp/blog/_header.html`
- **フッター**: `packages/lp/blog/_footer.html`
- **Metaタグ**: `packages/lp/blog/_meta.html`

これらのファイルは、管理画面（`/admin/layout-editor`）から編集できます。

### ブログ記事のURL

ブログ記事のURLは、ファイル名（拡張子を除く）がスラッグとして使用されます。

- ファイル: `packages/lp/blog/my-article.html`
- URL: `https://www.hudorosu.com/blog/my-article`

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
2. 自動的にデプロイが開始されます
3. 以降、`main`ブランチにプッシュするたびに自動デプロイされます

## 開発

### ローカル開発サーバーの起動

```bash
# プロジェクトルートから
cd packages/lp
npm run dev
```

開発サーバーは `http://localhost:3000` で起動します。

### ブログ記事のプレビュー

1. `packages/lp/blog/`ディレクトリにHTMLファイルを配置
2. 開発サーバーを起動
3. `http://localhost:3000/blog/[slug]` でアクセス

## 技術スタック

- **Next.js**: 14.2.0
- **React**: 18.2.0
- **TypeScript**: 5.2.2
- **Tailwind CSS**: 3.4.0

## 注意事項

- ブログ記事のファイル名は、URLのスラッグとして使用されます
- ファイル名には、英数字、ハイフン、アンダースコアのみを使用してください
- `_`で始まるファイル名は、共通レイアウトファイルとして扱われます（ブログ記事一覧に表示されません）
