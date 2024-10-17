import { Setting } from './types';

export * from './const';

export * from './types';

/**
 * 配置项默认值
 */
export const settingDefault: Setting = {
  interfacePrefix: false,
  keyPath: 'data',
  generateRequestFunc: true,
  requestFuncTypes: true,
  generateMockData: true
};
