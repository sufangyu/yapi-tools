/**
 * 休眠函数
 *
 * @param {number} duraction 秒
 * @return {*}  {Promise<void>}
 */
export const sleep = (duraction: number = 250): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, duraction));
};

/**
 * 将请求参数转换为接口代码
 *
 * @param {Query[]} query 查询参数
 * @param {string} defaultDesc 命名
 * @param {string} defaultDesc 默认描述
 * @return {*}
 */
export const queryToTypeCode = (
  query: Query[],
  rootName: string = "Request",
  defaultDesc: string = "注释"

): string => {
  const content = query.reduce((code, { required, name, desc }) => {
    const symbol = required === "0" ? "?" : "";
    return `${code}\n  /** ${
      desc || defaultDesc
    } */\n  ${name}${symbol}: string;`;
  }, "");
  return `export interface ${rootName} {${content}\n}`;
};

interface Query {
  /**
   * 是否必须.
   * - 0: 非必填
   * - 1: 必填
   */
  required: string;
  /**
   * 参数名称
   */
  name: string;
  /**
   * 参数描述
   */
  desc?: string;
}
