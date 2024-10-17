export interface Setting {
  /**
   * 接口命名是否带前缀
   *
   * @type {boolean}
   * @memberof Setting
   */
  interfacePrefix: boolean;
  /**
   * 实际有效响应体的对象key路径
   *
   * @type {string}
   * @memberof Setting
   */
  keyPath: string;
  /**
   * 是否生成请求函数
   *
   * @type {boolean}
   * @memberof Setting
   */
  generateRequestFunc: boolean;
  /**
   * 请求函数类型用 Types
   *
   * @type {boolean}
   * @memberof Setting
   */
  requestFuncTypes: boolean;

  /**
   * 是否生成 mock 数据
   *
   * @type {boolean}
   * @memberof Setting
   */
  generateMockData: boolean;
}
