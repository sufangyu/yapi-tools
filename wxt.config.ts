import { defineConfig } from "wxt";
import nodePolyfills from "rollup-plugin-polyfill-node";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-vue"],
  vite: () => ({
    plugins: [],
    optimizeDeps: {
      include: [],
      exclude: [],
    },
    define: {},
    external: [],
    resolve: {
      alias: {},
    },
    build: {
      rollupOptions: {
        plugins: [nodePolyfills()],
        external: [],
      },
    },
  }),
  manifest: {
    name: "Yapi-Tools",
    web_accessible_resources: [
      {
        resources: ["injected.js"],
        matches: ["*://*/*"],
      },
    ],
    permissions: [
      "webRequest",
      "storage",
      "tabs",
      "webNavigation",
      "activeTab", // 确保可以访问当前激活的标签页
    ],
  },
});
