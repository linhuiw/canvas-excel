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
    }
  };
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
    const excel = new Excel({
      ...this.config,
      container
    });
    const containerRect = excel.getContainerRect();
    this.setState({
      containerRect
    });
  }
  render() {
    const { width, height } = this.config;
    const { containerRect } = this.state;

    return (
      <div
        className="scroll-container"
        style={{
          width,
          height,
          overflow: 'auto'
        }}
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
              transform: 'translate(0px, 0px)'
            }}
          >
            <canvas width={width} height={height} ref={this.getContainer} />
          </div>
        </div>
      </div>
    );
  }
}
