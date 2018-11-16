/**
 * @author linhuiw
 * @desc Retina 屏幕 HighDpi 兼容
 * @desc https://github.com/jondavidjohn/hidpi-canvas-polyfill/blob/master/src/CanvasRenderingContext2D.js
 */

const forEach = function(obj: Object, func: Function) {
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      func(obj[p], p);
    }
  }
};

const ratioArgs = {
  fillRect: 'all',
  clearRect: 'all',
  strokeRect: 'all',
  moveTo: 'all',
  lineTo: 'all',
  arc: [0, 1, 2],
  arcTo: 'all',
  bezierCurveTo: 'all',
  isPointinPath: 'all',
  isPointinStroke: 'all',
  quadraticCurveTo: 'all',
  rect: 'all',
  translate: 'all',
  createRadialGradient: 'all',
  createLinearGradient: 'all'
};

function updateHighDpiContext(context, pixelRatio) {
  if (pixelRatio === 1) return;
  const prototype = context;

  forEach(ratioArgs, function(value, key) {
    context[key] = (function(_super) {
      return function() {
        var i,
          len,
          args = Array.prototype.slice.call(arguments);

        if (value === 'all') {
          args = args.map(function(a: number) {
            return a * pixelRatio;
          });
        } else if (Array.isArray(value)) {
          for (i = 0, len = value.length; i < len; i++) {
            args[value[i]] *= pixelRatio;
          }
        }

        return _super.apply(this, args);
      };
    })(context[key]);
  });

  // Stroke lineWidth adjustment
  prototype.stroke = (function(_super) {
    return function() {
      this.lineWidth *= pixelRatio;
      _super.apply(this, arguments);
      this.lineWidth /= pixelRatio;
    };
  })(prototype.stroke);

  // Text
  //
  prototype.fillText = (function(_super) {
    return function() {
      var args = Array.prototype.slice.call(arguments);

      args[1] *= pixelRatio; // x
      args[2] *= pixelRatio; // y

      this.font = this.font.replace(/(\d+)(px|em|rem|pt)/g, function(w, m, u) {
        return m * pixelRatio + u;
      });

      _super.apply(this, args);

      this.font = this.font.replace(/(\d+)(px|em|rem|pt)/g, function(w, m, u) {
        return m / pixelRatio + u;
      });
    };
  })(prototype.fillText);

  prototype.strokeText = function(_super) {
    return function() {
      var args = Array.prototype.slice.call(arguments);

      args[1] *= pixelRatio; // x
      args[2] *= pixelRatio; // y

      this.font = this.font.replace(/(\d+)(px|em|rem|pt)/g, function(w, m, u) {
        return m * pixelRatio + u;
      });

      _super.apply(this, args);

      this.font = this.font.replace(/(\d+)(px|em|rem|pt)/g, function(w, m, u) {
        return m / pixelRatio + u;
      });
    };
  };
  return context;
}

export { updateHighDpiContext };
