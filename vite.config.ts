import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  // base: process.env.NODE_ENV === "development" ? "/" : "/cpfedui/",
  base: "/cpfedui/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8002,
    open: true,
  },
});
