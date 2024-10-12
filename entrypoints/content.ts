import {
  type Setting,
  settingDefault,
  storageKeyForSetting,
} from "@/modules/setting";
import { version } from "../package.json";

export default defineContentScript({
  // matches: ["*://*/*"],
  matches: ["*://*/project/*/interface/api/*"],
  runAt: "document_end",
  async main() {
    window.addEventListener("message", handlePostMessageCallback);

    await injectScript("/injected.js", {
      keepInDom: true,
    });
    console.log(`[Yapi-Tools]: v${version} 加载完毕!`);
  },
});

/**
 * 处理 postMessage 回调
 *
 * @param {MessageEvent} event
 */
const handlePostMessageCallback = async (event: MessageEvent) => {
  const { type } = event.data;
  switch (type as string) {
    case "GET_SETTING":
      const installSetting = await storage.getItem(storageKeyForSetting);
      const curSetting = {
        ...settingDefault,
        ...((installSetting ?? {}) as Setting),
      };
      window.postMessage(
        { type: "GET_SETTING_CALLBACK", data: curSetting },
        "*"
      );
      break;
    default:
      break;
  }
};
