// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://genisisiq.com",
  trailingSlash: "always",
  build: {
    format: "directory",
  },
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      wrap: true,
    },
  },
  vite: {
    server: {
      fs: { allow: [".."] },
    },
  },
});
