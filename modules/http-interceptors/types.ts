export interface SchemaNode  {
  /**
   * schema 协议版本 URL
   *
   * @type {string}
   * @memberof SchemaNode
   */
  $schema?: string;
  /**
   * 类型
   *
   * @type {string}
   * @memberof SchemaNode
   */
  type: string;
  /**
   * 描述
   *
   * @type {string}
   * @memberof SchemaNode
   */
  description?: string;
  /**
   * 属性
   *
   * @type {Record<string, SchemaNode>}
   * @memberof SchemaNode
   */
  properties?: Record<string, SchemaNode>;
}