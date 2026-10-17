import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ttsApiPlugin } from './server/ttsMiddleware.js';

export default defineConfig({
  plugins: [react(), ttsApiPlugin()],
  server: {
    port: 3000,
    open: false
  }
});
