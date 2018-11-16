/**
 * @author linhuiw
 * @desc Excel 主入口文件
 */

import * as React from 'react';
import { Excel } from './excel';
import { ExcelConfig } from './excel/types';
import { DEFAULT_CONFIG } from './excel/config';

type Props = {
  config: Partial<ExcelConfig>;
};

export default class ExcelComponent extends React.Component<Props> {
  getContainer: React.RefObject<HTMLCanvasElement>;
  config: Partial<ExcelConfig>;
  state = {
    containerRect: {
      width: 0,
      height: 0
    },
    ratio: 1,
    transform: {
      top: 0,
      left: 0
    }
  };
  excelInstance: Excel;
  constructor(props: Props) {
    super(props);
    this.getContainer = React.createRef();
    this.config = {
      ...DEFAULT_CONFIG,
      ...props.config
    };
  }
  componentDidMount() {
    const container = this.getContainer.current as HTMLCanvasElement;
    this.excelInstance = new Excel({
      ...this.config,
      container
    });
    this.setState({
      containerRect: this.excelInstance.config.containerRect,
      ratio: this.excelInstance.config.ratio
    });
  }
  /**
   * WebExcel 滚动
   */
  handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft, scrollTop } = event.currentTarget;
    this.setState({
      transform: {
        top: scrollTop,
        left: scrollLeft
      }
    });
    this.excelInstance.setOffset(scrollTop, scrollLeft);
    this.excelInstance.repaint();
  };
  /**
   * 拖拽开始
   */
  handleDragStart(event: React.DragEvent<HTMLCanvasElement>) {
    const { clientX, clientY } = event;
    console.log(clientX, clientY, '======');
  }
  /**
   * 拖拽中
   */
  handleDrag(event: React.DragEvent<HTMLCanvasElement>) {
    const { clientX, clientY } = event;
    console.log(clientX, clientY, '======');
  }
  /**
   * 拖拽结束
   */
  handleDragEnd() {}
  render() {
    const { width = 0, height = 0 } = this.config;
    const { containerRect, transform, ratio } = this.state;

    return (
      <div
        className="scroll-container"
        style={{
          width,
          height,
          overflow: 'auto'
        }}
        onScroll={this.handleScroll}
      >
        <div
          className="large-container"
          style={{
            width: containerRect.width,
            height: containerRect.height,
            overflow: 'hidden'
          }}
        >
          <div
            className="container"
            style={{
              width: width * 2,
              height: height * 2,
              transformOrigin: 'top left',
              transform: `translate(${transform.left}px, ${
                transform.top
              }px) scale(${1 / ratio})`
            }}
          >
            <canvas
              onDragStart={this.handleDragStart}
              onDrag={this.handleDrag}
              onDragEnd={this.handleDrag}
              width={width}
              height={height}
              ref={this.getContainer}
            />
          </div>
        </div>
      </div>
    );
  }
}
