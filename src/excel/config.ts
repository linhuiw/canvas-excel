/**
 * @author linhuiw
 * @desc 默认配置
 */
import { ExcelConfig } from './types';

const DEFAULT_CONFIG: Partial<ExcelConfig> = {
  width: 1000,
  height: 800,
  data: [
    [
      {
        v: 1
      },
      {
        v: 2
      }
    ],
    [
      {
        v: 11
      },
      {
        v: 12
      }
    ]
  ],
  fontSize: 14,
  fontFamily: 'Microsoft YaHei',
  lineColor: '#ededed'
};

export { DEFAULT_CONFIG };
