import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    build: {
        outDir: 'dist',
    },
    server: {
        historyApiFallback: true,
    },
    resolve: {
        alias: {
            '@loading': path.resolve(__dirname, 'src/components/Loading'),
            '@axios': path.resolve(__dirname, 'src/utils/Axios'),

            '@components': path.resolve(__dirname, 'src/components'),
            '@data': path.resolve(__dirname, 'src/data'),
            '@utils': path.resolve(__dirname, 'src/utils'),
        },
    },
    plugins: [react()],
})
