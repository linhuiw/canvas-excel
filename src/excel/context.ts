/**
 * @author linhuiw
 * @desc 全局的 Context
 */

import { ExcelConfig } from './types';

class Context {
  config: ExcelConfig;
  setConfig(config: Partial<ExcelConfig>) {
    this.config = {
      ...this.config,
      ...config
    };
  }
}

const context = new Context();

export { context };
