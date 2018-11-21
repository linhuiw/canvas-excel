/**
 * @author linhuiw
 * @desc Excel 主入口文件
 */

import * as React from 'react';
import * as _ from 'lodash';
import { Excel } from './excel';
import { ExcelConfig } from './excel/types';
import { DEFAULT_CONFIG } from './excel/config';
import { context } from './excel/context';

type Props = {
  config: Partial<ExcelConfig>;
};

export default class ExcelComponent extends React.Component<Props> {
  getContainer: React.RefObject<HTMLCanvasElement>;
  getInput: React.RefObject<HTMLInputElement>;
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
    },
    input: {
      display: false,
      height: 0,
      width: 0,
      top: -200,
      left: -200,
      value: '',
      rowIndex: 0,
      colIndex: 0
    }
  };
  excelInstance: Excel;
  constructor(props: Props) {
    super(props);
    this.getContainer = React.createRef();
    this.getInput = React.createRef();
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
      containerRect: context.config.containerRect,
      ratio: context.config.ratio
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
  handleDragStart = (event: React.DragEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event;
    this.hideInput();
    this.excelInstance.setDragOffset({
      x: clientX,
      y: clientY
    });
  };
  /**
   * 拖拽中
   */
  handleDrag = (event: React.DragEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event;
    if (!clientX && !clientY) {
      return;
    }
    this.excelInstance.setDragOffset(undefined, {
      x: clientX,
      y: clientY
    });
  };
  /**
   * 点击画布
   */
  handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event;
    this.updateValue();
    this.excelInstance.setDragOffset({
      x: clientX,
      y: clientY
    });
  };

  /**
   * 双击画布
   */
  handleDbClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event;
    const cell = this.excelInstance.getCell(clientX, clientY);

    this.setState({
      input: {
        display: true,
        height: cell.height,
        width: cell.width,
        top: cell.top,
        left: cell.left,
        value: cell.v,
        rowIndex: cell._rowIndex,
        colIndex: cell._colIndex
      }
    });
    /** Focus 输入框 */
    setTimeout(() => {
      if (this.getInput.current) {
        this.getInput.current.focus();
      }
    }, 0);
  };
  /**
   * 处理输入框的
   */
  handleInputKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { charCode } = event;

    if (charCode === 13) {
      // Enter键
      this.updateValue();
    }
  };
  /**
   * 更新 Data 值
   */
  updateValue() {
    const { input } = this.state;
    if (!input.display) {
      return;
    }
    if (this.config.data && this.config.data.length) {
      _.set(
        this.config.data,
        [input.rowIndex, input.colIndex, 'v'],
        input.value
      );
    }
    this.hideInput();
    this.excelInstance.updateConfig(this.config);
  }
  /**
   * 隐藏输入框
   */
  hideInput = () => {
    const { input } = this.state;

    this.setState({
      input: {
        ...input,
        display: false
      }
    });
  };
  /**
   * 输入框的值变化，事件监听
   */
  handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const { input } = this.state;

    this.setState({
      input: {
        ...input,
        value
      }
    });
  };
  render() {
    const { width = 0, height = 0, fontSize } = this.config;
    const { containerRect, transform, input } = this.state;

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
              width: width,
              height: height,
              transformOrigin: 'top left',
              transform: `translate(${transform.left}px, ${transform.top}px)`
            }}
          >
            <canvas
              draggable
              onClick={this.handleClick}
              onDoubleClick={this.handleDbClick}
              onDragStart={this.handleDragStart}
              onDrag={this.handleDrag}
              onDragEnd={this.handleDrag}
              width={width}
              height={height}
              style={{
                width: width,
                height: height
              }}
              ref={this.getContainer}
            />
            <input
              style={{
                display: input.display ? 'block' : 'none',
                fontSize,
                position: 'absolute',
                boxSizing: 'border-box',
                outline: 0,
                top: input.top,
                left: input.left,
                width: input.width,
                height: input.height
              }}
              ref={this.getInput}
              value={input.value}
              onKeyPress={this.handleInputKey}
              onBlur={this.hideInput}
              onChange={this.handleValueChange}
            />
          </div>
        </div>
      </div>
    );
  }
}
