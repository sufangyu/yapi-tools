import { version } from "../package.json";

export default defineContentScript({
  matches: ["*://*/*"],
  runAt: "document_end",
  async main() {
    await injectScript("/injected.js", {
      keepInDom: true,
    });
    console.log(`[Yapi-Tools]: v${version} 加载完毕!`);
  },
});
