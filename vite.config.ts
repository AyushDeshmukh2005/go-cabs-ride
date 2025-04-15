
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
          // Add timeouts to prevent hanging connections
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('Proxy error:', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Proxying:', req.method, req.url);
            });
          }
        },
        '/health': {
          target: env.VITE_BACKEND_URL || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          // Add timeouts to prevent hanging connections
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('Health check proxy error:', err);
            });
          }
        },
        '/socket.io': {
          target: env.VITE_SOCKET_URL || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          ws: true,
          // Add timeouts to prevent hanging connections
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('WebSocket proxy error:', err);
            });
          }
        }
      }
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Define environment variables that will be statically replaced
    define: {
      // Provide fallbacks for required environment variables
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || '/api'),
      'import.meta.env.VITE_SOCKET_URL': JSON.stringify(env.VITE_SOCKET_URL || 'http://localhost:5000'),
      'import.meta.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(env.VITE_GOOGLE_MAPS_API_KEY || ''),
    },
    // Improve build performance
    build: {
      sourcemap: mode !== 'production',
      // Improve chunk splitting
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: [
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-label',
              '@radix-ui/react-tabs',
              '@radix-ui/react-toast',
              'lucide-react',
            ],
          }
        }
      }
    }
  };
});
