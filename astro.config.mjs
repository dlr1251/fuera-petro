import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
    integrations: [react()],
    output: 'hybrid',
    adapter: vercel(),
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
