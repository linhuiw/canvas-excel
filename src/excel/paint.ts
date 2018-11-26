/**
 * @author linhuiw
 * @desc 绘制 Excel 表格
 */
import { ExcelConfig, CellData } from './types';
import { CELL_WIDTH, CELL_HEIGHT, FILL_STYLE } from './const';
import { filterData } from './data';
import { context } from './context';
import { getXyPosition } from './utils/xyToIndex';

class Paint {
  canvasContext: CanvasRenderingContext2D;
  constructor(canvasContext: CanvasRenderingContext2D, config: ExcelConfig) {
    this.canvasContext = canvasContext;
    this.render();
  }
  /**
   * 绘制
   */
  render() {
    this.clear();
    this.paintCells();
    if (context.config.range && context.config.range.length) {
      this.paintRange();
    }
  }
  /**
   * 清理画布
   */
  clear() {
    const { width, height } = context.config;
    this.canvasContext.clearRect(0, 0, width, height);
  }
  /**
   * 渲染单元格内容
   */
  paintCell(cell: CellData) {
    const { freezeCol, freezeRow } = context.config;
    const { x, y } = getXyPosition(cell._colIndex, cell._rowIndex);

    if (cell._colIndex < freezeCol || cell._rowIndex < freezeRow) {
      /** 渲染冻结区域的背景 */
      this.canvasContext.fillStyle = '#FFF';
      /** 填满除边框外区域 */
      this.canvasContext.fillRect(
        x + 1,
        y + 1,
        CELL_WIDTH - 2,
        CELL_HEIGHT - 2
      );
    }
    this.canvasContext.fillStyle = '#000';
    this.canvasContext.fillText(
      String(cell.v),
      x + CELL_WIDTH / 2,
      y + CELL_HEIGHT / 2,
      CELL_WIDTH
    );
  }
  /**
   * 渲染全部单元格
   */
  paintCells() {
    const { fontFamily, fontSize } = context.config;
    const data = filterData(context.config);
    this.canvasContext.save();
    this.paintLines(data);
    this.canvasContext.font = `normal ${fontSize}px ${fontFamily}`;
    this.canvasContext.textBaseline = 'middle';
    this.canvasContext.textAlign = 'center';
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
    const {
      width,
      height,
      containerRect,
      offset,
      freezeCol,
      freezeRow
    } = context.config;
    this.canvasContext.beginPath();
    /** 绘制外边框 */
    this.canvasContext.rect(
      0,
      0,
      containerRect.width - offset.left - 0.5,
      containerRect.height - offset.top - 0.5
    );
    /** 冻结线的行列坐标 */
    const freezeStartX = freezeCol * CELL_WIDTH;
    const freezeStartY = freezeRow * CELL_HEIGHT;
    /** 绘制横线 */
    data.map((row, index) => {
      const { y } = getXyPosition(row[0]._colIndex, row[0]._rowIndex);
      if (y > freezeStartY) {
        this.canvasContext.moveTo(0.5, y);
        this.canvasContext.lineTo(width + 0.5, y);
      }
    });
    /** 绘制竖线 */
    data[0].map(col => {
      const { x } = getXyPosition(col._colIndex, col._rowIndex);
      if (x > freezeStartX) {
        this.canvasContext.moveTo(x, 0.5);
        this.canvasContext.lineTo(x, height + 0.5);
      }
    });
    this.canvasContext.stroke();
  }
  /**
   * 绘制冻结表示线
   */
  paintFreezeLines() {
    const { freezeCol, freezeRow, width, height, activeColor } = context.config;
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
   * 扩展选择区域
   */
  getExpandRange() {
    const { range, freezeCol, freezeRow } = context.config;
    const [start, end] = range;
    let startPosition = { ...start },
      endPosition = { ...end };

    if (end) {
      /** 扩展选择区域 */
      if (end.col < start.col) {
        startPosition.col = start.col + 1;
      } else {
        endPosition.col = end.col + 1;
      }
      if (end.row < start.row) {
        startPosition.row = start.row + 1;
      } else {
        endPosition.row = end.row + 1;
      }
    }
    const freezeX = freezeCol * CELL_WIDTH;
    const freezeY = freezeRow * CELL_HEIGHT;

    const { x: startX, y: startY } = getXyPosition(
      startPosition.col,
      startPosition.row
    );
    const { x: endX, y: endY } = getXyPosition(
      endPosition.col,
      endPosition.row
    );
    /**
     * 不覆盖到冻结区域
     */
    return {
      startX: Math.max(freezeX, startX),
      startY: Math.max(freezeY, startY),
      endX: Math.max(freezeX, endX),
      endY: Math.max(freezeY, endY)
    };
  }
  /**
   * 渲染高亮的单元格区域
   */
  paintRange() {
    const { activeColor } = context.config;
    const { startX, startY, endX, endY } = this.getExpandRange();

    this.canvasContext.save();
    this.canvasContext.beginPath();
    this.canvasContext.strokeStyle = activeColor;
    this.canvasContext.fillStyle = activeColor;

    this.canvasContext.rect(startX, startY, endX - startX, endY - startY);
    this.canvasContext.fillRect(endX - 2, endY - 2, 4, 4);
    this.canvasContext.fillStyle = FILL_STYLE;

    this.canvasContext.fillRect(startX, startY, endX - startX, endY - startY);
    this.canvasContext.stroke();
    this.canvasContext.restore();
  }
}

export { Paint };
