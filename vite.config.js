import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    optimizeDeps: {
        disabled: false
    },
    build: {
        commonjsOptions: {
            include: []
        }
    }
});
