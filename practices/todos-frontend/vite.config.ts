import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@style": fileURLToPath(new URL("./src/styles", import.meta.url)),
      "@api": fileURLToPath(new URL("./src/shared/api", import.meta.url)),
      "@ui": fileURLToPath(new URL("./src/shared/ui", import.meta.url)),
      "@utils": fileURLToPath(new URL("./src/shared/utils", import.meta.url)),
    },
  },
});
