import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    // Disable fast refresh to avoid preamble issues
    fastRefresh: false
  })],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5173,
    host: true
  }
});
