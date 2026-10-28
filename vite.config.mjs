import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// pdfjs-dist worker must be externalized so the browser loads it from the
// package (not bundled inline). Works in both dev and prod builds.
export default defineConfig({
  plugins: [react()],
  define: { 'import.meta.vite': null },
  resolve: {
    alias: {
      'pdfjs-dist/build/pdf.worker': fileURLToPath(
        new URL('./node_modules/pdfjs-dist/build/pdf.worker.mjs', import.meta.url)
      ),
    },
  },
});
