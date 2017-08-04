function Rect(data) {
  this.data = data;
  var rect = data.rect;
  data.points = [{
    x: rect.x,
    y: rect.y
  }, {
    x: rect.x + rect.w,
    y: rect.y
  }, {
    x: rect.x + rect.w,
    y: rect.y + rect.h
  }, {
    x: rect.x,
    y: rect.y + rect.h
  }];
  data.clockwise = Util.isPolygonClockwise(data.points);
}

Rect.prototype.draw = function (ctx, block) {
  var data = this.data;
  ctx.beginPath();
  ctx.fillStyle = data.fillColor;
  ctx.rect(data.rect.x, data.rect.y, data.rect.w, data.rect.h);
  ctx.fill();

  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Block', data.rect.x + data.rect.w / 2, data.rect.y + data.rect.h / 2);
};

Rect.prototype.contain = function (point) {
  var data = this.data;
  return Util.rectContainsPoint(data.rect, point);
};

Rect.prototype.offset = function (offsetx, offsety) {
  var data = this.data;
  data.points.forEach(function (point) {
    point.x += offsetx;
    point.y += offsety;
  });
  data.rect.x += offsetx;
  data.rect.y += offsety;
};
