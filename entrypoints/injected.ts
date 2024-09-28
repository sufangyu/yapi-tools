import { render } from "@/modules/render";
import { listenResponse, handlerResponse } from "@/modules/http-interceptors/";

export default defineUnlistedScript(() => {
  listenResponse("/api/interface/get", handlerResponse(render));
});
