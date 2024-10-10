import jsonToTs from "raw-to-ts";
import { InterfaceCode, YapiResponse } from "../render/types";
import { SchemaNode } from "./types";
// import { queryToTypeCode } from "../../utils/index";

export const handlerResponse = (render: (code: InterfaceCode) => void) => {
  return async (response: Response) => {
    try {
      const res = (await response.json()) as YapiResponse;
      const data = res.data;
      const isGet = data.method === "GET";
      const requestRaw = JSON.parse(data?.req_body_other || `{}`);
      const responseRaw = JSON.parse(data?.res_body || `{}`) as SchemaNode;
      const rootNameBase = formatUrlToPascalCase(data.path)
      // 请求参数转换为接口代码
      const requestTypeCode = isGet
        ? queryToTypeCode(data.req_query, `${rootNameBase}Req`)
        : jsonToTs(requestRaw, { rootName: `${rootNameBase}Req` })
            .reduce((a, b) => `${a}\n\n${b}`)
            .replaceAll(" ?:", "?:");

      // TODO: 实际有效响应体的改为配置（获取属性中指定的对象）
      const responseData = responseRaw.properties?.data.type === 'null' ? {} : responseRaw.properties?.data;
      const responseTypeCode = jsonToTs(responseData, { rootName: `${rootNameBase}Res` })
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
  // 移除花括号及其内部内容
  const cleanedUrl = url.replace(/\{.*?\}/g, '');

  // 拆分路径，过滤空值，并取最后两项
  const parts = cleanedUrl.split("/").filter(Boolean).slice(-2);

  // 如果没有找到任何有效部分，返回空字符串
  if (parts.length === 0) {
    return "";
  }

  // 处理每个部分，将中横线和下划线后的字符转为大写
  const result = parts.reduce((acc, part) => {
    const formattedPart = part.replace(/[-_](.)/g, (_, char) => char.toUpperCase());
    const capitalizedPart = formattedPart.charAt(0).toUpperCase() + formattedPart.slice(1);
    return acc + capitalizedPart;
  }, '');

  return result;
};
