import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const isInlinePreview = process.env.INLINE_PREVIEW === '1';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: isInlinePreview
        ? {
            inlineDynamicImports: true,
          }
        : {
            manualChunks: {
              'react-vendor': ['react', 'react-dom'],
              'icons-vendor': ['lucide-react'],
            },
          },
    },
  },
});
