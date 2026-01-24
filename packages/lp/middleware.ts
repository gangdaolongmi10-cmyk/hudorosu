export { default } from "next-auth/middleware"

export const config = {
    // 保護したいルートのパスを指定します
    // 例: お買い物リストをログイン必須にする場合
    matcher: ["/shopping-list/:path*"],
}
