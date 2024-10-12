import jsonToTs from 'raw-to-ts';
import { InterfaceCode, YapiResponse } from '../render/types';
import { type Setting } from '../setting';
import { SchemaNode } from './types';

export const handlerResponse = (
  render: (code: InterfaceCode, setting: Setting) => void,
  setting: Setting
) => {
  return async (response: Response) => {
    try {
      // console.log("获取设置 =>>", setting);
      const res = (await response.json()) as YapiResponse;
      const data = res.data;
      const isGet = data.method === 'GET';
      const requestRaw = JSON.parse(data?.req_body_other || `{}`);
      const responseRaw = JSON.parse(data?.res_body || `{}`) as SchemaNode;
      const { interfacePrefix, keyPath } = setting;
      // 接口命名是否有 I 前缀
      const hasInterfacePrefix = interfacePrefix;
      let rootNameBase = formatUrlToPascalCase(data.path);
      rootNameBase = hasInterfacePrefix ? `I${rootNameBase}` : rootNameBase;
      // 请求参数转换为接口代码
      const requestTypeCode = isGet
        ? queryToTypeCode(data.req_query, `${rootNameBase}Req`)
        : jsonToTs(requestRaw, { rootName: `${rootNameBase}Req` })
            .reduce((a, b) => `${a}\n\n${b}`)
            .replaceAll(' ?:', '?:');

      // 实际有效响应体的对象key路径
      const dataKeyPath = keyPath;
      let transformData: SchemaNode | null = findSchemaNodeByPath(responseRaw, dataKeyPath);

      if (!transformData) {
        console.warn('[Yapi-Tools]: 配置的keyPath配置的路径不存在, 使用完整响应体!');
        transformData = responseRaw;
      }

      // 处理没有子属性 或者 阶段类型为 null 时候，创建空对象
      if (
        (!['object', 'array'].includes(transformData?.type!) && !transformData?.properties) ||
        transformData?.type === 'null'
      ) {
        transformData.properties = {};
      }

      const responseTypeCode = jsonToTs(transformData, {
        rootName: `${rootNameBase}Res`
      })
        .reduce((a, b) => `${a}\n\n${b}`)
        .replaceAll(' ?:', '?:');

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
        reqParams: data.req_params,
        reqQuery: data.req_query,
        reqBody: data.req_body_other,
        requestTypeCode,
        responseTypeCode,
        pageUrl: document.location.href,
        rootNameBase
      };
      render(interfaceCode, setting);
    } catch (error) {
      console.error(`Yapi-Tools-Extension: ${(error as Error).message as string}`);
    }
  };
};

/**
 * 将 url 格式化为PascalCase命名
 *
 * - 移除花括号及其内部内容
 * - 移除版本号信息
 *
 * @param {string} url
 * @return {*}  {string}
 */
const formatUrlToPascalCase = (url: string): string => {
  // 移除花括号及其内部内容
  const cleanedUrl = url.replace(/\{.*?\}/g, '');

  // 拆分路径，过滤空值、版本号（如 v1、V1），并取最后两项
  const parts = cleanedUrl
    .split('/')
    .filter((part) => Boolean(part) && !/^v\d+$/i.test(part))
    .slice(-2);

  // 如果没有找到任何有效部分，返回空字符串
  if (parts.length === 0) {
    return '';
  }

  // 处理每个部分，将中横线和下划线后的字符转为大写
  const result = parts.reduce((acc, part) => {
    const formattedPart = part.replace(/[-_](.)/g, (_, char) => char.toUpperCase());
    const capitalizedPart = formattedPart.charAt(0).toUpperCase() + formattedPart.slice(1);
    return acc + capitalizedPart;
  }, '');

  return result;
};

/**
 * 根据路径查找 schema 节点
 *
 * @param {SchemaNode} schema 原始 schema
 * @param {string} path 路径
 * @return {*}  {(any | null)}
 */
const findSchemaNodeByPath = (schema: SchemaNode, path: string): SchemaNode | null => {
  if (!path) {
    return schema;
  }

  const keys = path.split('.');
  let currentSchema = schema;

  for (const key of keys) {
    if (
      currentSchema.type === 'object' &&
      currentSchema.properties &&
      currentSchema.properties[key]
    ) {
      // 进入 object 的下一层
      currentSchema = currentSchema.properties[key];
    } else if (currentSchema.type === 'array' && currentSchema.items) {
      // 处理 array 类型，进入 items
      currentSchema = currentSchema.items;
    } else {
      // 路径不存在时
      return null;
    }
  }

  return currentSchema;
};
