function Block(canvas) {
  this.canvas = canvas;
  this.shapes = [];
  this.init();
}

Block.prototype.init = function () {
  var self = this,
    canvas = this.canvas;
  canvas.tabIndex = 0;
  canvas.style.outline = 'none';
  canvas.addEventListener('keydown', function (e) {
    if (!lastShape) {
      return;
    }
    var code = e.keyCode;
    if (code === 37 /*left*/ ) {
      e.preventDefault();
      lastShape.offset(-5, 0);
      self.draw();
    } else if (code === 38 /*up*/ ) {
      e.preventDefault();
      lastShape.offset(0, -5);
      self.draw();
    } else if (code === 39 /*right*/ ) {
      e.preventDefault();
      lastShape.offset(5, 0);
      self.draw();
    } else if (code === 40 /*down*/ ) {
      e.preventDefault();
      lastShape.offset(0, 5);
      self.draw();
    }
  });
  var lastPoint, shape, lastShape;
  canvas.addEventListener('mousedown', function (e) {
    lastShape = shape = self.getShapeAt(e);
    lastPoint = {
      x: e.clientX,
      y: e.clientY
    };
  });
  canvas.addEventListener('mousemove', function (e) {
    if (!shape) {
      return;
    }
    var point = {
        x: e.clientX,
        y: e.clientY
      },
      offsetx = point.x - lastPoint.x,
      offsety = point.y - lastPoint.y;
    shape.offset(offsetx, offsety);
    self.draw();
    lastPoint = point;
  });
  canvas.addEventListener('mouseup', function (e) {
    lastPoint = null;
    shape = null;
  });
};

Block.prototype.add = function (shape) {
  this.shapes.push(shape);
};

Block.prototype.setSize = function (width, height) {
  var canvas = this.canvas;
  canvas.width = width;
  canvas.height = height;
  Util.toHighDPI(canvas);
};

Block.prototype.draw = function () {
  var self =this,
    canvas = this.canvas,
    shapes = this.shapes,
    ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  shapes.forEach(function (shape) {
    ctx.save();
    shape.draw(ctx, self);
    ctx.restore();
  });
};

Block.prototype.getPointAt = function (e) {
  var bound = this.canvas.getBoundingClientRect();
  return {
    x: e.clientX - bound.left,
    y: e.clientY - bound.top
  };
};

Block.prototype.getShapesAt = function (e) {
  var point = this.getPointAt(e);
  return this.shapes.filter(function (shape) {
    return shape.contain(point);
  });
};

Block.prototype.getShapeAt = function (e) {
  var shapes = this.getShapesAt(e);
  return shapes[shapes.length - 1];
};
