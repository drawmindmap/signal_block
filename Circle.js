function Circle(data) {
  this.data = data;
}

Circle.prototype.draw = function (ctx, block) {
  var self = this,
    data = self.data,
    shapes = block.shapes,
    center = data.center,
    r = data.r,
    blocked;
  shapes = shapes.filter(function (shape) {
    if (!(shape instanceof Circle)) {
      if (Util.polygonContainsPoint(shape.data.points, center)) {
        blocked = true;
      }
      return true;
    }
    return false;
  });

  if (blocked) {
    return;
  }

  shapes.forEach(function (shape) {
    if (shape.data.points.length < 2) {
      return;
    }
    var points = shape.data.points.map(function (point, index) {
      return { point: point };
    });
    points.forEach(function (point) {
      point._angle = Util.getAngle(center, point.point);
      if (point._angle < 0) {
        point.angle = point._angle + Math.PI * 2;
      } else {
        point.angle = point._angle;
      }
    });
    var minIndex = -1,
      maxIndex = -1,
      _minIndex = -1,
      _maxIndex = -1,
      between = false,
      minPoint, maxPoint;
    points.forEach(function (point, index) {
      if (_minIndex < 0) {
        _minIndex = index;
      } else {
        if (point._angle < points[_minIndex]._angle) {
          _minIndex = index;
        }
      }
      if (_maxIndex < 0) {
        _maxIndex = index;
      } else {
        if (point._angle > points[_maxIndex]._angle) {
          _maxIndex = index;
        }
      }
    });
    minPoint = points[_minIndex].point;
    maxPoint = points[_maxIndex].point;
    if (Math.max(minPoint.x, maxPoint.x) > center.x &&
        ((minPoint.y <= center.y && center.y <= maxPoint.y) ||
          (maxPoint.y <= center.y && center.y <= minPoint.y))) {
      minIndex = _minIndex;
      maxIndex = _maxIndex;
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
      minPoint = points[minIndex].point;
      maxPoint = points[maxIndex].point;
    }

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(minPoint.x, minPoint.y);

    var count = 50,
      startAngle = between ? points[minIndex]._angle : points[minIndex].angle,
      endAngle = between ? points[maxIndex]._angle : points[maxIndex].angle,
      delta = (endAngle - startAngle) / count;
    for (var i = 0; i <= count; i++) {
      var circlePoint = getPointOnCircle(center, r, startAngle + delta * i);
      ctx.lineTo(circlePoint.x, circlePoint.y);
    }
    // ctx.arc(center.x, center.y, r, points[minIndex].angle, points[maxIndex].angle, between);

    ctx.lineTo(maxPoint.x, maxPoint.y);
    var i = maxIndex,
      minddleIndex = maxIndex;
    while(minddleIndex !== minIndex) {
      if (shape.data.clockwise) {
        i++;
      } else {
        i--;
      }
      minddleIndex = (i + points.length) % points.length;
      ctx.lineTo(points[minddleIndex].point.x, points[minddleIndex].point.y);
    }
    ctx.lineTo(minPoint.x, minPoint.y);
    ctx.stroke();

    function getPointOnCircle (center, r, angle) {
      return {
        x: center.x + r * Math.cos(angle),
        y: center.y + r * Math.sin(angle)
      };
    }

    ctx.beginPath();
    ctx.moveTo(minPoint.x, minPoint.y);
    ctx.arc(center.x, center.y, r, points[minIndex].angle, points[maxIndex].angle, true);
    ctx.lineTo(maxPoint.x, maxPoint.y);
    var i = maxIndex,
      minddleIndex = maxIndex;
    while(minddleIndex !== minIndex) {
      if (shape.data.clockwise) {
        i++;
      } else {
        i--;
      }
      minddleIndex = (i + points.length) % points.length;
      ctx.lineTo(points[minddleIndex].point.x, points[minddleIndex].point.y);
    }
    ctx.lineTo(minPoint.x, minPoint.y);
    ctx.clip();
  });

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
