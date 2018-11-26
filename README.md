# canvas-excel

> online excel built with canvas

[![NPM](https://img.shields.io/npm/v/canvas-excel.svg)](https://www.npmjs.com/package/canvas-excel) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Demo

Demo: https://linhuiw.github.io/canvas-excel/

## Features

- [x] Scroll canvas table
- [x] Freeze cols & rows
- [x] Range select & Edit cell
- [ ] Drag to edit row height & column width

## Install

```bash
npm install --save canvas-excel
```

## Usage

```tsx
import * as React from 'react';

import WebExcel from 'canvas-excel';

class Example extends React.Component {
  render() {
    return <WebExcel />;
  }
}
```

## License

MIT © [linhuiw](https://github.com/linhuiw)
