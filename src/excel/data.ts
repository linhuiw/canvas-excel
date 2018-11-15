/**
 * @author linhuiw
 * @desc 筛选得到绘图区域数据
 */
import { ExcelConfig, CellData } from './types';
import { CELL_HEIGHT, CELL_WIDTH } from './const';
import { DEFAULT_CONFIG } from './config';
/**
 * 预处理数据
 * @param data
 */
const pretreatmentData = function(
  data: CellData[][] | undefined
): CellData[][] {
  if (!data) {
    return DEFAULT_CONFIG.data as CellData[][];
  }
  return data.map((row: CellData[], rowIndex: number) => {
    return row.map((cell: CellData, colIndex: number) => {
      return {
        ...cell,
        _colIndex: colIndex,
        _rowIndex: rowIndex
      };
    });
  });
};

/**
 * 筛选可视区域内的数据
 * @param config
 */
const filterData = function(config: ExcelConfig) {
  const { width, height, offset, data, freezeCol, freezeRow } = config;
  const { top, left } = offset;
  const offset_row = Math.floor(top / CELL_HEIGHT) + freezeRow;
  const offset_col = Math.floor(left / CELL_WIDTH) + freezeCol;
  const end_row = Math.ceil((top + height) / CELL_HEIGHT) + freezeRow;
  const end_col = Math.ceil((left + width) / CELL_WIDTH) + freezeCol;
  const freezeRows = data.slice(0, freezeRow);
  const visibleRows = data.slice(offset_row, end_row);

  return freezeRows.concat(visibleRows).map(row => {
    const freezeCols = row.slice(0, freezeCol);
    const visibleCols = row.slice(offset_col, end_col);
    return freezeCols.concat(visibleCols);
  });
};

export { pretreatmentData, filterData };
