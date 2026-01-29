import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: resolve(__dirname, 'public'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log em produção
        drop_debugger: true
      }
    },
    rollupOptions: {
      input: {
        main: './src/pages/index.html',
        admin: './src/pages/admin/dashboard.html',
        adminLogin: './src/pages/admin/login.html'
      },
      output: {
        manualChunks: {
          // Separar Supabase em chunk próprio para melhor cache
          'supabase': ['@supabase/supabase-js'],
          // Separar utilitários
          'utils': [
            './src/lib/utils/helpers.js',
            './src/lib/utils/debounce.js',
            './src/lib/utils/validators.js'
          ]
        },
        // Otimizar nomes de arquivos para cache
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    // Otimizações de performance
    chunkSizeWarningLimit: 1000,
    sourcemap: false, // Desabilitar sourcemaps em produção para reduzir tamanho
    cssCodeSplit: true // Separar CSS para melhor cache
  },
  server: {
    port: 3000,
    open: '/'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@services': resolve(__dirname, 'src/services'),
      '@lib': resolve(__dirname, 'src/lib'),
      '@styles': resolve(__dirname, 'src/styles')
    }
  },
  // Otimizações de CSS
  css: {
    devSourcemap: false
  }
});
