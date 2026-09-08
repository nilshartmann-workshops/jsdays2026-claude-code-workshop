/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite";
import tanstackRouter from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const BACKEND_URL = "http://localhost:3380";

console.log(` 🌱 Using Backend at ${BACKEND_URL}`);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    // https://tailwindcss.com/docs/installation/using-vite
    tailwindcss(),
    react(),
  ],
  server: {
    host: "0.0.0.0",
    port: 3300,
    strictPort: true,
    proxy: {
      "/api": BACKEND_URL,
    },
  },
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
