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
  type?: string;
  /**
   * 描述
   *
   * @type {string}
   * @memberof SchemaNode
   */
  description?: string;
  /**
   * 对象类型的属性
   *
   * @type {Record<string, SchemaNode>}
   * @memberof SchemaNode
   */
  properties?: Record<string, SchemaNode>;
  /**
   * 数组类型的子类型
   *
   * @type {SchemaNode}
   * @memberof SchemaNode
   */
  items?: SchemaNode;
}