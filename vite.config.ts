// Simple Vercel Node function that delegates to your built server bundle.
// Adjust the require path if the bundle filename berbeda (lihat dist/server).
// Use a runtime require to avoid TypeScript errors when the built server bundle has no type declarations.
// @ts-ignore: built server bundle may not have type declarations
const server: any = require('../dist/server/server.js'); // <-- ganti jika nama lain
const handler = server?.default || server?.handler || server;

export const vercelHandler = (req: any, res: any) => {
  // many SSR bundles expose a (req,res) handler — if not, beri tahu saya output dist/server
  return handler(req, res);
};

import { defineConfig } from "@lovable.dev/vite-tanstack-config";

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