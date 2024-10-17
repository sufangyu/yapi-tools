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

const generateMockData = (schema: JSONSchema): MockData => {
  switch (schema.type) {
    case 'string':
      // 生成随机中文字符串
      return Mock.Random.cword(3, 8);
    case 'integer':
    case 'number':
      // 生成随机整数
      return Mock.Random.integer(1, 100);
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
      return Array.from({ length: arrayLength }, () => generateMockData(itemSchema));
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

const isEmptyObject = (obj: object): boolean => {
  // 判断是否是对象并且是否为空对象
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

type MockData = string | number | boolean | MockData[] | { [key: string]: MockData } | null;

interface JSONSchema {
  type: 'string' | 'integer' | 'number' | 'boolean' | 'array' | 'object';
  mock?: string;
  properties?: { [key: string]: JSONSchema };
  items?: JSONSchema; // 用于定义数组内的项
  required?: string[];
}
