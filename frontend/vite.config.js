import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: "./src/main.jsx",
      output: {
        entryFileNames: "react-build.js",
      },
    },
    outDir: "../static/build/",
    emptyOutDir: true,
    manifest: true,
  },
  server: {
    origin: "http://localhost:8000",
    cors: true,
  },
});
