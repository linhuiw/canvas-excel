/**
 * @author linhuiw
 * @desc 默认配置
 */
import { ExcelConfig } from './types';

const DEFAULT_CONFIG: Partial<ExcelConfig> = {
  width: 800,
  height: 600,
  freezeCol: 0,
  freezeRow: 0,
  data: [[]],
  fontSize: 14,
  fontFamily: 'Microsoft YaHei',
  lineColor: '#ededed',
  activeColor: '#00c1de',
  offset: {
    top: 0,
    left: 0
  }
};

export { DEFAULT_CONFIG };
