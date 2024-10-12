import { render } from "@/modules/render";
import { listenResponse, handlerResponse } from "@/modules/http-interceptors/";

export default defineUnlistedScript(() => {
  window.postMessage({ type: "GET_SETTING" }, "*");

  window.addEventListener("message", (event) => {
    const { type, data } = event.data;
    if (type === "GET_SETTING_CALLBACK") {
      listenResponse("/api/interface/get", handlerResponse(render, data));
    }
  });
});
