import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Let Vite choose any available port (no strict binding)
    // Remove explicit port so it falls back to 5173+ and picks the next free one
    // strictPort false allows automatic fallback to an open port
    // port: 5173, // intentionally omitted for dynamic selection
    strictPort: false,
    host: true,
    // Use default HMR settings so client port matches the chosen server port
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true,
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  cacheDir: '.vite',
  build: {
    sourcemap: true,
    emptyOutDir: true,
  },
  clearScreen: false,
});
