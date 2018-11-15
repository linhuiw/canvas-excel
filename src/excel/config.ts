/**
 * @author linhuiw
 * @desc 默认配置
 */
import { ExcelConfig } from './types';

const DEFAULT_CONFIG: Partial<ExcelConfig> = {
  width: 1000,
  height: 800,
  data: [[]],
  fontSize: 14,
  fontFamily: 'Microsoft YaHei',
  lineColor: '#ededed',
  offset: {
    top: 0,
    left: 0
  }
};

export { DEFAULT_CONFIG };
