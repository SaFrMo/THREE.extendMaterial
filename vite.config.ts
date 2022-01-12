import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-dts'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), dts()],
    build: {
        lib: {
            entry: './src/extendMaterial/index.ts',
            name: 'ExtendMaterial',
            fileName: (format) => `extend-material.${format}.js`,
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: ['three', 'vue'],
            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {
                    vue: 'Vue',
                    three: 'THREE',
                },
            },
        },
    },
})
