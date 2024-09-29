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
        : jsonToTs(requestRaw, {
            rootName: formatUrlToPascalCase(data.path) + "Req",
          })
            .reduce((a, b) => `${a}\n\n${b}`)
            .replaceAll(" ?:", "?:");

      const responseTypeCode = jsonToTs(responseRaw, {
        rootName: formatUrlToPascalCase(data.path) + "Res",
      })
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

/**
 * 将 url 格式化为PascalCase命名
 *
 * @param {string} url
 * @return {*}  {string}
 */
const formatUrlToPascalCase = (url: string): string => {
  const parts = url.split("/").filter(Boolean).slice(-2);

  // 如果没有找到任何有效部分，返回空字符串
  if (parts.length === 0) {
    return "";
  }

  // 使用 reduce 方法处理拼接和首字母大写
  return parts.reduce((acc, part) => {
    const capitalizedPart = part.charAt(0).toUpperCase() + part.slice(1);
    return acc + capitalizedPart;
  }, "");
};
