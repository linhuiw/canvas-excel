/**
 * @author linhuiw
 * @desc 绘制 Excel 表格
 */
import { ExcelConfig, CellData } from './types';

class Paint {
  config: ExcelConfig;
  canvasContext: CanvasRenderingContext2D;
  constructor(canvasContext: CanvasRenderingContext2D, config: ExcelConfig) {
    this.config = config;
    this.canvasContext = canvasContext;
    this.clear();
    this.paintCells();
  }
  /**
   * 清理画布
   */
  clear() {
    const { width, height } = this.config;
    this.canvasContext.clearRect(0, 0, width, height);
  }
  /**
   * 渲染单元格
   */
  paintCell(cell: CellData, rowNumber: number, colNumber: number) {
    // console.log(cell, '------');
    const cw = 80;
    const ch = 50;
    const startX = rowNumber * cw;
    const startY = colNumber * ch;
    this.canvasContext.rect(startX, startY, cw, ch);
    this.canvasContext.stroke();
    this.canvasContext.fillText(
      String(cell.v),
      startX + cw / 2,
      startY + ch / 2,
      cw
    );
  }
  /**
   * 渲染全部单元格
   */
  paintCells() {
    console.log(this.config, '=====');
    const { data } = this.config;
    for (let rowNumber = 0; rowNumber < data.length; rowNumber++) {
      const row = data[rowNumber];
      for (let colNumber = 0; colNumber < row.length; colNumber++) {
        const cell = row[colNumber];
        this.paintCell(cell, rowNumber, colNumber);
      }
    }
  }
}

export { Paint };
