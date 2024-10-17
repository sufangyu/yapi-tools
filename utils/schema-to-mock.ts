import Mock from 'mockjs';

/**
 * jsonSchema 生成 Mock 数据
 *
 * @param {JSONSchema} schema
 * @return {*}  {MockData}
 */
export const jsonSchemaToMock = (schema: JSONSchema): MockData => {
  const mockData = generateMockData(schema);

  return mockData;
};

/**
 * 递归生成 mock 数据
 *
 * @param {JSONSchema} schema
 * @param {string} [description='']
 * @return {*}  {MockData}
 */
const generateMockData = (schema: JSONSchema, description: string = ''): MockData => {
  switch (schema.type) {
    case 'string':
      const mockStringRes = getMockValue(schema, schema.type, description);
      // 生成随机中文字符串
      return mockStringRes || Mock.Random.cword(3, 8);
    case 'integer':
    case 'number':
      const mockNumberRes = getMockValue(schema, schema.type, description);

      // 生成随机整数
      return mockNumberRes || Mock.Random.integer(1, 100);
    case 'boolean':
      // 生成随机布尔值
      return Mock.Random.boolean();
    case 'array':
      const itemSchema = schema.items;
      if (!itemSchema) {
        return [];
      }

      // 随机生成数组长度
      const arrayLength = Mock.Random.integer(1, 5);
      return Array.from({ length: arrayLength }, () =>
        generateMockData(itemSchema, schema.description)
      );
    case 'object':
      const mockObject: { [key: string]: MockData } = {};
      if (!schema.properties || isEmptyObject(schema.properties)) {
        return {};
      }

      // 遍历 properties 并递归生成对应的 mock 数据
      for (const key in schema.properties) {
        const curSchema = schema.properties[key];
        mockObject[key] = generateMockData(curSchema);
      }
      return mockObject;
    default:
      // 对于未处理的类型返回 null
      return null;
  }
};

/**
 * 获取有配置 mock 类型的数据
 *
 * - 1. 如果 schema 中配置了 mock 则使用 mock 中的值
 * - 2. 如果 schema 中未配置 mock, 尝试从 schema 中获取 description 信息设置 mock 类型
 *
 * @param {JSONSchema} schema
 * @param {('string' | 'number' | 'integer')} type
 * @param {string} [description='']
 * @return {*}  {(string | number)}
 */
const getMockValue = (
  schema: JSONSchema,
  type: 'string' | 'number' | 'integer',
  description: string = ''
): string | number => {
  const mock = schema.mock || {};
  const isDate = /(时间|日期)/.test(schema?.description ?? description ?? '');
  const isImage = /(图|图片)/.test(schema?.description ?? description ?? '');

  if (!mock || (!isDate && !isImage)) {
    return '';
  }

  let mockType = '';
  isDate && (mockType = '@datetime');
  isImage && (mockType = '@image');

  const mockRes = Mock.mock({
    value: mockType
  }) as { value: string };

  return ['number', 'integer'].includes(type)
    ? new Date(`${mockRes.value}`).getTime()
    : mockRes.value;
};

// 判断是否是对象并且是否为空对象
const isEmptyObject = (obj: object): boolean => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

type MockData = string | number | boolean | MockData[] | { [key: string]: MockData } | null;

interface JSONSchema {
  type: 'string' | 'integer' | 'number' | 'boolean' | 'array' | 'object';
  mock?: { mock?: string };
  properties?: { [key: string]: JSONSchema };
  items?: JSONSchema; // 用于定义数组内的项
  required?: string[];
  description?: string;
}
