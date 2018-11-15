/**
 * @author linhuiw
 * @desc 绘制 Excel 表格
 */
import { ExcelConfig, CellData } from './types';
import { CELL_WIDTH, CELL_HEIGHT } from './const';
import { filterData } from './data';

class Paint {
  config: ExcelConfig;
  canvasContext: CanvasRenderingContext2D;
  constructor(canvasContext: CanvasRenderingContext2D, config: ExcelConfig) {
    this.config = config;
    this.canvasContext = canvasContext;
    this.render();
  }
  /**
   * 绘制
   */
  render(config?: ExcelConfig) {
    if (config) {
      this.config = config;
    }
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
  paintCell(cell: CellData) {
    const { offset } = this.config;
    const startX = cell._colIndex * CELL_WIDTH - offset.left;
    const startY = cell._rowIndex * CELL_HEIGHT - offset.top;
    this.canvasContext.rect(startX, startY, CELL_WIDTH, CELL_HEIGHT);
    this.canvasContext.fillText(
      String(cell.v),
      startX + CELL_WIDTH / 2,
      startY + CELL_HEIGHT / 2,
      CELL_WIDTH
    );
  }
  /**
   * 渲染全部单元格
   */
  paintCells() {
    const data = filterData(this.config);
    this.canvasContext.beginPath();
    for (let rowNumber = 0; rowNumber < data.length; rowNumber++) {
      const row = data[rowNumber];
      for (let colNumber = 0; colNumber < row.length; colNumber++) {
        const cell = row[colNumber];
        this.paintCell(cell);
      }
    }
    this.canvasContext.stroke();
  }
  /**
   * 渲染高亮的单元格
   */
  paintActiveCell(cell: CellData) {
    const { activeColor, offset } = this.config;
    this.canvasContext.save();
    this.canvasContext.beginPath();
    this.canvasContext.strokeStyle = activeColor;
    this.canvasContext.fillStyle = activeColor;
    const startX = cell._colIndex * CELL_WIDTH - offset.left;
    const startY = cell._rowIndex * CELL_HEIGHT - offset.top;

    this.canvasContext.rect(startX, startY, CELL_WIDTH, CELL_HEIGHT);
    this.canvasContext.fillRect(
      startX + CELL_WIDTH - 2,
      startY + CELL_HEIGHT - 2,
      4,
      4
    );
    this.canvasContext.stroke();
    this.canvasContext.restore();
  }
}

export { Paint };
