import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    integrations: [react()],
    output: 'hybrid',
    vite: {
        optimizeDeps: {
            // Exclude TypeScript files from optimization
            exclude: ['src/lib/*.ts'],
        },
        ssr: {
            // Process TypeScript files in SSR mode
            resolve: {
                conditions: ['node'],
            },
        },
    },
});
