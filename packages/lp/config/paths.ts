import path from 'path'

/**
 * ブログ記事の保存先ディレクトリ
 * Next.jsの実行時はprocess.cwd()がpackages/lpになるため、相対パスで指定
 */
export const BLOG_DIR = path.resolve(process.cwd(), 'blog')

/**
 * 共通レイアウトファイルの保存先ディレクトリ
 * ブログ記事と同じディレクトリ
 */
export const LAYOUT_DIR = BLOG_DIR

/**
 * 共通レイアウトファイル名
 */
export const LAYOUT_FILES = {
  HEADER: '_header.html',
  FOOTER: '_footer.html',
  META: '_meta.html',
} as const

/**
 * 共通レイアウトファイルのフルパス
 */
export const getLayoutFilePaths = () => ({
  header: path.join(LAYOUT_DIR, LAYOUT_FILES.HEADER),
  footer: path.join(LAYOUT_DIR, LAYOUT_FILES.FOOTER),
  meta: path.join(LAYOUT_DIR, LAYOUT_FILES.META),
})
