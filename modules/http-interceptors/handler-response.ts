import jsonToTs from "raw-to-ts";
import { InterfaceCode, YapiResponse } from "../render/types";
// import { queryToTypeCode } from "../../utils/index";

export const handlerResponse = (render: (code: InterfaceCode) => void) => {
  return async (response: Response) => {
    try {
      const res = (await response.json()) as YapiResponse;
      const data = res.data;
      const isGet = data.method === "GET";
      const requestRaw = JSON.parse(data?.req_body_other || `{}`);
      const responseRaw = JSON.parse(data?.res_body || `{}`);
      // 请求参数转换为接口代码
      const requestTypeCode = isGet
        ? queryToTypeCode(data.req_query)
        : jsonToTs(requestRaw, { rootName: "Request" })
            .reduce((a, b) => `${a}\n\n${b}`)
            .replaceAll(" ?:", "?:");

      const responseTypeCode = jsonToTs(responseRaw, { rootName: "Response" })
        .reduce((a, b) => `${a}\n\n${b}`)
        .replaceAll(" ?:", "?:");

      // console.log("requestRaw =>>", requestRaw);
      // console.log("responseRaw =>>", responseRaw);
      // console.log("请求代码", requestTypeCode);
      // console.log("响应代码", responseTypeCode);

      // 渲染 app
      // const code = `${requestCode}\n\n${responseCode}`;
      const interfaceCode: InterfaceCode = {
        method: data.method,
        title: data.title,
        path: data.path,
        requestTypeCode,
        responseTypeCode,
        pageUrl: document.location.href,
      };
      render(interfaceCode);
    } catch (error) {
      console.error(
        `Yapi-Tools-Extension: ${(error as Error).message as string}`
      );
    }
  };
};
