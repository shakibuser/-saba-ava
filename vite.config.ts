import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables, including those without VITE_ prefix
  // The third parameter '' tells Vite to load all env vars, not just VITE_*
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Explicitly stringify the API key to be replaced during build
      // This ensures 'process.env.API_KEY' in your code becomes the actual key string
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});
