var Util = {};

Util.toHighDPI = function (canvas) {
  var ctx = canvas.getContext('2d'),
    width = canvas.width,
    height = canvas.height,
    ratio = window.devicePixelRatio;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.scale(ratio, ratio);
};

Util.getDistance = function (p1, p2) {
  var dx = p1.x - p2.x,
    dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

Util.rectContainsPoint = function (rect, point) {
  return point.x >= rect.x &&
    point.x <= rect.x + rect.w &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.h;
};

Util.getAngle = function (p1, p2) {
  var angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
  return angle;
};

Util.getBounds = function (points) {
  var rect = {
    x: 0,
    y: 0,
    w: 0,
    h: 0
  };
  if (points) {
    points.forEach(function (point, index) {
      if (index === 0) {
        rect.x = point.x;
        rect.y = point.y;
      } else {
        var x1 = Math.min(rect.x, point.x);
        var x2 = Math.max(rect.x + rect.w, point.x);
        var y1 = Math.min(rect.y, point.y);
        var y2 = Math.max(rect.y + rect.h, point.y);
        rect.x = x1;
        rect.y = y1;
        rect.w = x2 - x1;
        rect.h = y2 - y1;
      }
    });
  }
  return rect;
};

Util.polygonContainsPoint = function (points, point) {
  if (points.length < 3) {
    return false;
  }
  var result = false,
    size = points.length,
    i, j, p1, p2;
  for (i = 0, j = size - 1; i < size; j = i++) {
    p1 = points[i];
    p2 = points[j];
    if (((p1.y > point.y) != (p2.y > point.y)) &&
        (point.x < (p2.x - p1.x) * (point.y - p1.y) / (p2.y - p1.y) + p1.x)) {
      result = !result;
    }
  }
  return result;
};

// https://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-points-are-in-clockwise-order
Util.isPolygonClockwise = function (points) {
  var area = 0,
    size = points.length,
    i, p1, p2;
  for (i = 0; i < size; i++) {
    p1 = points[i];
    p2 = points[i === size - 1 ? 0 : i + 1];
    area += (p2.x - p1.x) * (p2.y + p1.y);
  }
  return area < 0;
};

Util.isSamePoint = function (p1, p2) {
  return p1.x === p2.x && p1.y === p2.y;
};
