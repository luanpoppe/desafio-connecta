import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig(({ command }) => {
  if (command === "build") {
    return {
      plugins: [react(), tailwindcss()],
      build: {
        lib: {
          entry: resolve(__dirname, "src/index.ts"),
          formats: ["es"],
          fileName: "index",
        },
        rollupOptions: {
          external: ["react", "react-dom", "react/jsx-runtime"],
        },
        copyPublicDir: false,
      },
    };
  }

  return {
    root: "playground",
    plugins: [react(), tailwindcss()],
    server: { port: 5174, open: true },
  };
});
