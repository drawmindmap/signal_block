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

Util.containsPoint = function (rect, point) {
  return point.x >= rect.x && point.x <= rect.x + rect.w && point.y >= rect.y && point.y <= rect.y + rect.h;
};

Util.getAngle = function (p1, p2) {
  var angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
  if (angle < 0) {
    angle += Math.PI * 2;
  }
  return angle;
};
