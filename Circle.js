function Circle(data) {
  this.data = data;
}

Circle.prototype.draw = function (ctx, block) {
  var self = this,
    data = self.data,
    shapes = block.shapes,
    center = data.center,
    r = data.r,
    rect, points, blocked;
  block.shapes.forEach(function (shape) {
    if (!(shape instanceof Rect)) {
      return;
    }
    rect = shape.data.rect;
    if (Util.containsPoint(rect, center)) {
      blocked = true;
    }
    points = [{
        point: {
          x: rect.x,
          y: rect.y
        }
      }, {
        point: {
          x: rect.x + rect.w,
          y: rect.y
        }
      }, {
        point: {
          x: rect.x + rect.w,
          y: rect.y + rect.h
        }
      }, {
        point: {
          x: rect.x,
          y: rect.y + rect.h
        }
      }];
    points.forEach(function (point) {
      point.angle = Util.getAngle(center, point.point);
    });
    var minIndex = -1,
      maxIndex = -1,
      between = false;
    if (rect.x + rect.w > center.x &&
      rect.y <= center.y &&
      rect.y + rect.h >= center.y) {
      minIndex = 3;
      maxIndex = 0;
      between = true;
    } else {
      points.forEach(function (point, index) {
        if (minIndex < 0) {
          minIndex = index;
        } else {
          if (point.angle < points[minIndex].angle) {
            minIndex = index;
          }
        }
        if (maxIndex < 0) {
          maxIndex = index;
        } else {
          if (point.angle > points[maxIndex].angle) {
            maxIndex = index;
          }
        }
      });
    }

    ctx.beginPath();
    ctx.moveTo(points[minIndex].point.x, points[minIndex].point.y);
    ctx.arc(center.x, center.y, r, points[minIndex].angle, points[maxIndex].angle, !between);
    ctx.lineTo(points[maxIndex].point.x, points[maxIndex].point.y);
    if ((minIndex + 1) % 4 !== maxIndex) {
      var minddleIndex = (maxIndex + 1) % 4;
      ctx.lineTo(points[minddleIndex].point.x, points[minddleIndex].point.y);
    }
    ctx.lineTo(points[minIndex].point.x, points[minIndex].point.y);
    ctx.clip();
  });

  if (blocked) {
    return;
  }

  ctx.beginPath();
  ctx.fillStyle = data.fillColor;
  ctx.arc(data.center.x, data.center.y, data.r, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Signal', data.center.x, data.center.y);

  ctx.beginPath();
  ctx.fillStyle = 'red';
  ctx.arc(data.center.x, data.center.y, 2, 0, Math.PI * 2);
  ctx.fill();
};

Circle.prototype.contain = function (point) {
  var data = this.data;
  return Util.getDistance(point, data.center) <= data.r;
};

Circle.prototype.offset = function (offsetx, offsety) {
  var data = this.data;
  data.center.x += offsetx;
  data.center.y += offsety;
};
