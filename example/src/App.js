import React, {
  Component
} from 'react'

import ExampleComponent from 'canvas-excel'

export default class App extends Component {
  constructor(props) {
    super(props);
    this.config = this.getTestConfig();
  }
  getTestConfig() {
    let data = [];
    const rowNumber = 60;
    const colNumber = 50;
    for (let i = 0; i < rowNumber; i++) {
      const col = [];
      for (let j = 0; j < colNumber; j++) {
        col.push({
          v: `${i}~${j}`
        });
      }
      data.push(col);
    };
    return {
      data
    };
  }
  render() {
    return <div >
      <
      ExampleComponent config = {
        this.config
      }
    / > < /
    div > ;
  }
}
