import { defineConfig } from 'vite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default defineConfig({
  // Define environment variables to be replaced in the client code
  define: {
    'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL || ''),
    'process.env.SUPABASE_KEY': JSON.stringify(process.env.SUPABASE_KEY || '')
  },
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
