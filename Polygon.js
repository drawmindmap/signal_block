function Polygon(data) {
  var self = this;
  self.data = data;
  self._refresh();
}

Polygon.prototype._refresh = function () {
  var data = this.data;
  data.rect = Util.getBounds(data.points);
  data.clockwise = Util.isPolygonClockwise(data.points);
};

Polygon.prototype.addPoint = function (point) {
  var self = this,
    points = this.data.points;
  if (points.length === 0 || !Util.isSamePoint(point, points.length - 1)) {
    points.push(point);
    self._refresh();
  }
};

Polygon.prototype.draw = function (ctx, block) {
  var data = this.data;
  ctx.beginPath();
  ctx.fillStyle = data.fillColor;
  data.points.forEach(function (point) {
    ctx.lineTo(point.x, point.y);
  });
  ctx.fill();

  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Block', data.rect.x + data.rect.w / 2, data.rect.y + data.rect.h / 2);
};

Polygon.prototype.contain = function (point) {
  var data = this.data;
  return Util.polygonContainsPoint(data.points, point);
};

Polygon.prototype.offset = function (offsetx, offsety) {
  var data = this.data;
  data.points.forEach(function (point) {
    point.x += offsetx;
    point.y += offsety;
  });
  data.rect.x += offsetx;
  data.rect.y += offsety;
};
