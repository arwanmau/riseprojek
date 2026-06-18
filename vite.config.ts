// ...existing code...
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { defineConfig } from '@tanstack/react-start/config'
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    build: {
      outDir: "dist"
    }
  }
});