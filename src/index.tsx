/**
 * @author linhuiw
 * @desc Excel 主入口文件
 */

import * as React from 'react';
import './styles.css';
import { Excel } from './excel';
import { ExcelConfig } from './excel/types';
import { DEFAULT_CONFIG } from './excel/config';

type Props = {
  config: Partial<ExcelConfig>;
};

export default class ExcelComponent extends React.Component<Props> {
  getContainer: React.RefObject<HTMLCanvasElement>;
  config: Partial<ExcelConfig>;
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
    new Excel({
      ...this.config,
      container
    });
  }
  render() {
    const { width, height } = this.config;

    return (
      <div>
        <canvas width={width} height={height} ref={this.getContainer} />
      </div>
    );
  }
}
