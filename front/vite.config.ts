import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/v1': {
        target: 'https://glraback.rcchome.com.br',
        changeOrigin: true,
      },
      '/api': {
        target: 'https://glraback.rcchome.com.br',
        changeOrigin: true,
      },
    },
  },
});
