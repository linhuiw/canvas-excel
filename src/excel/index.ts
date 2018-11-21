/**
 * @author 五灵
 * @desc 初始化 Excel
 */
import * as _ from 'lodash';
import { ExcelConfig, CellData } from './types';
import { DEFAULT_CONFIG } from './config';
import { Paint } from './paint';
import { CELL_WIDTH, CELL_HEIGHT } from './const';
import { pretreatmentData } from './data';
import { xyToIndex, updateHighDpiContext } from './utils/';
import { context } from './context';

class Excel {
  canvasContext: CanvasRenderingContext2D;
  paintInstance: Paint;
  constructor(config: Partial<ExcelConfig>) {
    const { container } = config as ExcelConfig;
    const canvasContext = container.getContext(
      '2d'
    ) as CanvasRenderingContext2D;
    const data = pretreatmentData(config.data);
    const ratio = this.getRatio(canvasContext);
    this.canvasContext = updateHighDpiContext(
      canvasContext,
      ratio
    ) as CanvasRenderingContext2D;
    const allConfig = {
      ...DEFAULT_CONFIG,
      ...config,
      data,
      ratio,
      containerRect: this.getContainerRect(data)
    } as ExcelConfig;
    context.setConfig(allConfig);
    this.initCanvas();
    this.addClickEvent();
  }
  /**
   * 初始化画布设置
   */
  initCanvas() {
    this.setCanvas();
    this.paintInstance = new Paint(this.canvasContext, context.config);
  }
  /**
   * 设置画布的基础设置
   */
  setCanvas() {
    const {
      fontSize,
      fontFamily,
      width,
      height,
      lineColor,
      container,
      ratio
    } = context.config;
    this.canvasContext.lineWidth = 1;
    this.canvasContext.font = `normal ${fontSize}px ${fontFamily}`;
    this.canvasContext.textBaseline = 'middle';
    this.canvasContext.strokeStyle = lineColor;
    this.canvasContext.textAlign = 'center';
    this.canvasContext.lineJoin = 'round';
    if (ratio !== 1) {
      container.width = width * ratio;
      container.height = height * ratio;
    }
  }
  /**
   * 获取Ratio，处理高清屏模糊问题
   */
  getRatio(canvasContext: any) {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const backingStoreRatio =
      canvasContext.webkitBackingStorePixelRatio ||
      canvasContext.mozBackingStorePixelRatio ||
      canvasContext.msBackingStorePixelRatio ||
      canvasContext.oBackingStorePixelRatio ||
      canvasContext.backingStorePixelRatio ||
      1;
    return devicePixelRatio / backingStoreRatio;
  }
  /**
   * 获取画布的最大高度和宽度
   */
  getContainerRect(data: CellData[][]) {
    const rows = data.length;
    const cols = _.get(data, [0, 'length'], 0);
    return {
      width: cols * CELL_WIDTH,
      height: rows * CELL_HEIGHT
    };
  }
  /**
   * 设置滚动后的 Offset
   * @param top
   * @param left
   */
  setOffset(top: number, left: number) {
    context.setConfig({
      offset: {
        top,
        left
      }
    });
  }
  /**
   * 重新渲染
   */
  repaint() {
    requestAnimationFrame(() => {
      this.paintInstance.render();
    });
  }
  /**
   *
   */
  setDragOffset(
    start?: {
      x: number;
      y: number;
    },
    end?: {
      x: number;
      y: number;
    }
  ) {
    let range = context.config.range;
    if (start) {
      const startCell = xyToIndex(start.x, start.y, context.config);
      range = [
        {
          row: startCell._rowIndex,
          col: startCell._colIndex
        }
      ];
    }
    if (end) {
      const endCell = xyToIndex(end.x, end.y, context.config);
      range = [
        range[0],
        {
          row: endCell._rowIndex,
          col: endCell._colIndex
        }
      ];
    }
    context.setConfig({
      range
    });
    this.repaint();
  }
  /**
   * 添加点击事件
   */
  addClickEvent() {
    const { container, ratio } = context.config;
    container.addEventListener('click', (event: MouseEvent) => {
      const { offsetX, offsetY } = event;
      const cell = xyToIndex(offsetX, offsetY, context.config);
      context.setConfig({
        range: [
          {
            row: cell._rowIndex,
            col: cell._colIndex
          }
        ]
      });
      this.repaint();
    });
  }
}

export { Excel };
