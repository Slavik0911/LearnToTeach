import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // This configuration is used for resolving the paths of the imports,
    // it allows us to use absolute imports with the "@" alias instead of relative imports
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  theme: {
    extend: {
      fontFamily: {
        sans: ["Fredoka", "sans-serif"],
      },
    },
  },
  },
});
