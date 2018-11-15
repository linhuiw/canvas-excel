/**
 * @author linhuiw
 * @desc Excel 定义文件
 */

/**
 * Excel 配置数据
 */
interface ExcelConfig {
  /** 画布宽度 */
  width: number;
  /** 画布高度 */
  height: number;
  /** 画布数据 */
  data: CellData[][];
  /** Ecel 渲染容器 */
  container: HTMLCanvasElement;
  /** 文字大小 */
  fontSize: number;
  /** 文字 font-family */
  fontFamily: string;
  /** 表格分割线颜色 */
  lineColor: string;
  /** 滚动偏移量 */
  offset: {
    top: number;
    left: number;
  };
}

/**
 * 单个单元格的数据配置
 */
interface CellData {
  v: string | number;
}

export { ExcelConfig, CellData };
