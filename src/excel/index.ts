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
import { xyToIndex } from './utils/';

class Excel {
  config: ExcelConfig;
  canvasContext: CanvasRenderingContext2D;
  paintInstance: Paint;
  constructor(config: Partial<ExcelConfig>) {
    const { container } = config as ExcelConfig;
    this.canvasContext = container.getContext('2d') as CanvasRenderingContext2D;
    const data = pretreatmentData(config.data);
    const ratio = this.getRatio();
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
      data,
      ratio,
      containerRect: this.getContainerRect(data)
    } as ExcelConfig;
    this.initCanvas();
    this.addClickEvent();
  }
  /**
   * 初始化画布设置
   */
  initCanvas() {
    this.setCanvas();
    this.paintInstance = new Paint(this.canvasContext, this.config);
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
    } = this.config;
    this.canvasContext.lineWidth = 1;
    this.canvasContext.font = `normal ${fontSize * ratio}px ${fontFamily}`;
    this.canvasContext.textBaseline = 'middle';
    this.canvasContext.strokeStyle = lineColor;
    this.canvasContext.textAlign = 'center';
    if (ratio !== 1) {
      container.width = width * ratio;
      container.height = height * ratio;
    }
    this.canvasContext.scale(ratio, ratio);
  }
  /**
   * 获取Ratio，处理高清屏模糊问题
   */
  getRatio() {
    const canvasContext: any = this.canvasContext;
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
    this.config = {
      ...this.config,
      offset: {
        top,
        left
      }
    };
  }
  /**
   * 重新渲染
   */
  repaint(cell?: CellData) {
    requestAnimationFrame(() => {
      this.paintInstance.render(this.config);
      if (cell) {
        this.paintInstance.paintActiveCell(cell);
      }
    });
  }
  /**
   * 添加点击事件
   */
  addClickEvent() {
    const { container, ratio } = this.config;
    container.addEventListener('click', (event: MouseEvent) => {
      const { offsetX, offsetY } = event;
      const cell = xyToIndex(offsetX / ratio, offsetY / ratio, this.config);
      this.repaint(cell);
    });
  }
}

export { Excel };
