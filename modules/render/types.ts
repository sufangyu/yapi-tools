/**
 * 接口代码类型
 *
 * @interface InterfaceCode
 */
export interface InterfaceCode {
  /**
   * 请求方法
   *
   * @type {string}
   * @memberof InterfaceCode
   */
  method: string;
  /**
   * 接口名称
   *
   * @type {string}
   * @memberof InterfaceCode
   */
  title: string;
  /**
   * 接口地址
   *
   * @type {string}
   * @memberof InterfaceCode
   */
  path: string;
  /**
   * 接口地址中的参数
   *
   * @type {{name: string; desc: string}[]}
   * @memberof InterfaceCode
   */
  reqParams: {name: string; desc: string}[];
  /**
   * 请求 Query
   *
   * @type {{name: string; desc: string}[]}
   * @memberof InterfaceCode
   */
  reqQuery: {name: string; desc: string}[];
  /**
   * 请求 Body
   *
   * @type {string}
   * @memberof InterfaceCode
   */
  reqBody: string;
  /**
   * 请求参数类型
   *
   * @type {string}
   * @memberof InterfaceCode
   */
  requestTypeCode: string;
  /**
   * 返回参数类型
   *
   * @type {string}
   * @memberof InterfaceCode
   */
  responseTypeCode: string;
  /**
   * 接口文档页面地址
   *
   * @type {string}
   * @memberof InterfaceCode
   */
  pageUrl: string;
  /**
   * 函数、类型基础名称
   *
   * @type {string}
   * @memberof InterfaceCode
   */
  rootNameBase: string;
}

/**
 * YAPI 接口响应数据
 *
 * @export
 * @interface YapiResponse
 */
export interface YapiResponse {
  errcode: number;
  errmsg: string;
  data: {
    query_path: { path: string; params: any[] };
    edit_uid: number;
    status: string;
    type: string;
    req_body_is_json_schema: boolean;
    res_body_is_json_schema: boolean;
    api_opened: boolean;
    index: number;
    tag: any[];
    _id: number;
    method: string;
    catid: number;
    title: string;
    path: string;
    project_id: number;
    res_body_type: string;
    uid: number;
    add_time: number;
    up_time: number;
    req_body_form: any[];
    req_params: any[];
    req_headers: any[];
    req_query: {
      required: string;
      _id: string;
      desc: string;
      example: string;
      name: string;
    }[];
    __v: number;
    desc: string;
    markdown: string;
    res_body: string;
    req_body_other: string;
    username: string;
  };
}
