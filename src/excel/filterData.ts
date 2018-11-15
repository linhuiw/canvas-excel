/**
 * @author linhuiw
 * @desc 筛选得到绘图区域数据
 */
import { ExcelConfig } from './types';
import { CELL_HEIGHT, CELL_WIDTH } from './const';

const filterData = function(config: ExcelConfig) {
  const { width, height, offset, data } = config;
  const { top, left } = offset;
  const offset_row = Math.ceil(top / CELL_HEIGHT);
  const offset_col = Math.ceil(left / CELL_WIDTH);
  const end_row = Math.ceil((top + height) / CELL_HEIGHT);
  const end_col = Math.ceil((left + width) / CELL_WIDTH);
  return data.slice(offset_row, end_row).map(row => {
    return row.slice(offset_col, end_col);
  });
};

export { filterData };
