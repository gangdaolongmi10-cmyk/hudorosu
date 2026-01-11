import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig({
    plugins: [react(), tsconfigPaths({
        ignoreConfigErrors: true,
        root: './',
        projects: ['./tsconfig.json']
    })],
    resolve: {
        alias: {
            // 開発環境ではsrc、本番環境ではdistを参照
            // ViteはTypeScriptファイルを直接処理できるため、開発環境ではsrcを参照
            '@shared': path.resolve(__dirname, '../../shared/src'),
            '@hudorosu/shared': path.resolve(__dirname, '../../shared/src'),
        }
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:3000',
                changeOrigin: true,
                secure: false
            }
        }
    },
    build: {
        outDir: 'dist',
        sourcemap: false, // 本番環境ではソースマップを無効化（セキュリティ向上）
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom'],
                    axios: ['axios']
                }
            }
        }
    }
})
