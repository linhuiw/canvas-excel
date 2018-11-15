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
    const data = pretreatmentData(config.data);
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
      data,
      containerRect: this.getContainerRect(data)
    } as ExcelConfig;
    this.initCanvas();
    this.addClickEvent();
  }
  /**
   * 初始化画布设置
   */
  initCanvas() {
    const { container } = this.config;
    this.canvasContext = container.getContext('2d') as CanvasRenderingContext2D;
    this.getRatio();
    this.setCanvas();
    this.paintInstance = new Paint(this.canvasContext, this.config);
  }
  /**
   * 设置画布的基础设置
   */
  setCanvas() {
    const { fontSize, fontFamily, lineColor } = this.config;
    this.canvasContext.lineWidth = 1;
    this.canvasContext.font = `normal ${fontSize}px ${fontFamily}`;
    this.canvasContext.textBaseline = 'middle';
    this.canvasContext.strokeStyle = lineColor;
    this.canvasContext.textAlign = 'center';
  }
  /**
   * 获取Ratio，处理高清屏模糊问题
   */
  getRatio() {
    const devicePixelRatio = window.devicePixelRatio || 1;
    return devicePixelRatio;
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
    const { container } = this.config;
    container.addEventListener('click', (event: MouseEvent) => {
      const { offsetX, offsetY } = event;
      const cell = xyToIndex(offsetX, offsetY, this.config);
      this.repaint(cell);
    });
  }
}

export { Excel };
