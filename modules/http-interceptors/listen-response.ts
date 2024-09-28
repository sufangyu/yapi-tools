import { BatchInterceptor } from "@mswjs/interceptors";
import { XMLHttpRequestInterceptor } from "@mswjs/interceptors/XMLHttpRequest";

/**
 * 监听请求和响应的拦截器
 *
 * @param {string} path 请求路径
 * @param {(res: Response) => void} handler 处理函数
 */
export const listenResponse = async (
  path: string,
  handler: (res: Response) => void
) => {
  try {
    const interceptor = new BatchInterceptor({
      name: "interceptor",
      interceptors: [new XMLHttpRequestInterceptor()],
    });

    interceptor.on("request", ({ request }) => {
      // console.log("[%s] %s", request.method, request.url.toString());
    });

    interceptor.on("response", ({ request, response }) => {
      // console.log("[%s] %s", request.method, request.url.toString());
      const requestUrl = new URL(request.url);
      const matched = requestUrl.pathname === path;
      matched && handler(response);
    });

    interceptor.apply();
  } catch (error) {
    console.error(
      `Yapi-Tools-Extension: ${(error as Error).message as string}`
    );
  }
};
