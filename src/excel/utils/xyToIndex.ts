/**
 * @author linhuiw
 * @desc 将 XY 坐标，转化为具体的 Col, Row 的 Index
 */
import * as _ from 'lodash';
import { CELL_HEIGHT, CELL_WIDTH } from '../const';
import { context } from '../context';

/**
 * 根据坐标获取对应单元格的坐标
 * @param offsetX
 * @param offsetY
 */
function xyToIndex(offsetX: number, offsetY: number) {
  const { offset, data } = context.config;
  const rowIndex = Math.floor((offset.top + offsetY) / CELL_HEIGHT);
  const colIndex = Math.floor((offset.left + offsetX) / CELL_WIDTH);
  const cell = _.get(data, [rowIndex, colIndex]);

  return cell;
}

/**
 * 根据单元格的 Index 获取单元格开的的左上角坐标
 * @param col
 * @param row
 */
function getXyPosition(colIndex: number, rowIndex: number) {
  const { offset, freezeCol, freezeRow } = context.config;
  let x, y;
  if (colIndex < freezeCol) {
    x = colIndex * CELL_WIDTH;
  } else {
    x = colIndex * CELL_WIDTH - offset.left;
  }
  if (rowIndex < freezeRow) {
    /** 冻结行 */
    y = rowIndex * CELL_HEIGHT;
  } else {
    y = rowIndex * CELL_HEIGHT - offset.top;
  }

  return {
    x,
    y
  };
}

export { xyToIndex, getXyPosition };
