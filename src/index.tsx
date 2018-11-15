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
      containerRect: this.excelInstance.getContainerRect()
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

  render() {
    const { width, height } = this.config;
    const { containerRect, transform } = this.state;

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
              width,
              height,
              transform: `translate(${transform.left}px, ${transform.top}px)`
            }}
          >
            <canvas width={width} height={height} ref={this.getContainer} />
          </div>
        </div>
      </div>
    );
  }
}
