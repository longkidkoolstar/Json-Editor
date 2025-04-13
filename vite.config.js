import { defineConfig } from 'vite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default defineConfig({
  // Environment variables are automatically exposed by Vite when prefixed with VITE_
  // No need to manually define them here as they're accessible via import.meta.env.VITE_*
  // Configure the build
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  },
  // Configure the dev server
  server: {
    port: 3000,
    open: true
  }
});
