import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env": process.env,
    
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@tailwindConfig": path.resolve(__dirname, "tailwind.config.js"),
    
    },
  },
  optimizeDeps: {
    include: ["@tailwindConfig"],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  server: {
    port: 5173, // Specify the port here
    proxy: {
      "/parkapi-image-proxy": {
        target: "https://meeticketdevui.vmaxtechservices.help",
        changeOrigin: true,
        secure: false,
        rewrite: (requestPath) =>
          requestPath.replace(
            /^\/parkapi-image-proxy/,
            "/parkapi/WalkerPassParkImages"
          ),
      },
    },
  },
});
