/**
 * @author linhuiw
 * @desc 将 XY 坐标，转化为具体的 Col, Row 的 Index
 */
import * as _ from 'lodash';
import { ExcelConfig } from '../types';
import { CELL_HEIGHT, CELL_WIDTH } from '../const';

function xyToIndex(offsetX: number, offsetY: number, config: ExcelConfig) {
  const { offset, data } = config;
  const rowIndex = Math.floor((offset.top + offsetY) / CELL_HEIGHT);
  const colIndex = Math.floor((offset.left + offsetX) / CELL_WIDTH);
  const cell = _.get(data, [rowIndex, colIndex]);

  return cell;
}

export { xyToIndex };
