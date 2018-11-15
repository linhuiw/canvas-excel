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
   *
   */
  getStartXY(colIndex: number, rowIndex: number) {
    const { offset, freezeCol, freezeRow } = this.config;
    let startX, startY;
    if (colIndex < freezeCol) {
      startX = colIndex * CELL_WIDTH;
    } else {
      startX = colIndex * CELL_WIDTH - offset.left;
    }
    if (rowIndex < freezeRow) {
      /** 冻结行 */
      startY = rowIndex * CELL_HEIGHT;
    } else {
      startY = rowIndex * CELL_HEIGHT - offset.top;
    }
    return {
      startX,
      startY
    };
  }
  /**
   * 渲染单元格内容
   */
  paintCell(cell: CellData) {
    const { freezeCol, freezeRow } = this.config;
    const { startX, startY } = this.getStartXY(cell._colIndex, cell._rowIndex);

    if (cell._colIndex < freezeCol || cell._rowIndex < freezeRow) {
      /** 渲染冻结区域的背景 */
      this.canvasContext.fillStyle = '#FFF';
      /** 填满除边框外区域 */
      this.canvasContext.fillRect(
        startX + 1,
        startY + 1,
        CELL_WIDTH - 2,
        CELL_HEIGHT - 2
      );
    }
    // this.canvasContext.rect(startX, startY, CELL_WIDTH, CELL_HEIGHT);
    this.canvasContext.fillStyle = '#000';
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
    this.canvasContext.save();
    this.paintLines(data);
    /** 从最后开始渲染，保障冻结得行列在最上面 */
    for (let rowNumber = data.length - 1; rowNumber >= 0; rowNumber--) {
      const row = data[rowNumber];
      for (let colNumber = row.length - 1; colNumber >= 0; colNumber--) {
        const cell = row[colNumber];
        this.paintCell(cell);
      }
    }
    this.canvasContext.restore();
    this.paintFreezeLines();
  }
  /**
   * 渲染表格线
   * @param data
   */
  paintLines(data: CellData[][]) {
    const { width, height, containerRect, lineColor } = this.config;
    this.canvasContext.beginPath();
    /** 绘制外边框 */
    this.canvasContext.moveTo(0, 0);
    this.canvasContext.lineTo(0, containerRect.height);
    this.canvasContext.lineTo(containerRect.width, containerRect.height);
    this.canvasContext.lineTo(containerRect.width, 0);
    this.canvasContext.lineTo(0, 0);
    /** 绘制横线 */
    data.map(row => {
      const { startY } = this.getStartXY(row[0]._colIndex, row[0]._rowIndex);
      this.canvasContext.moveTo(0.5, startY);
      this.canvasContext.lineTo(width + 0.5, startY);
    });
    /** 绘制竖线 */
    data[0].map(col => {
      const { startX } = this.getStartXY(col._colIndex, col._rowIndex);
      this.canvasContext.moveTo(startX, 0.5);
      this.canvasContext.lineTo(startX, height + 0.5);
    });
    this.canvasContext.stroke();
  }
  /**
   * 绘制冻结表示线
   */
  paintFreezeLines() {
    const { freezeCol, freezeRow, width, height, activeColor } = this.config;
    const startX = freezeCol * CELL_WIDTH;
    const startY = freezeRow * CELL_HEIGHT;
    this.canvasContext.save();
    this.canvasContext.beginPath();
    this.canvasContext.strokeStyle = activeColor;
    this.canvasContext.moveTo(0.5, startY);
    this.canvasContext.lineTo(width + 0.5, startY);
    this.canvasContext.moveTo(startX, 0.5);
    this.canvasContext.lineTo(startX, height + 0.5);
    this.canvasContext.stroke();
    this.canvasContext.restore();
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
