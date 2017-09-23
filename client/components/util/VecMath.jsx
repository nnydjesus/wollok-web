import * as PIXI from "pixi.js"

export function sum(p1, p2) {
  return new PIXI.Point(p1.x + p2.x, p1.y + p2.y);
}

export function sumScalar(p1, scalar) {
  return new PIXI.Point(p1.x + scalar, p1.y + scalar);
}

export function diff(p2, p1) {
  return new PIXI.Point(p2.x - p1.x, p2.y - p1.y);
}

export function scl(p1, scalar) {
  return new PIXI.Point(p1.x * scalar, p1.y * scalar);
}

export function boundScalar(scalar, min, max) {
  return Math.max(Math.min(scalar, max), min)
}

export function angleToOrigin(p) {
  return Math.atan2(p.y, p.x);
}

export function distanceSq(p1, p2) {
  let dx = p2.x - p1.x;
  let dy = p2.y - p1.y;
  return dx * dx + dy * dy;
}

export function distance(p1, p2) {
  return Math.sqrt(distanceSq(p1, p2));
}

export function boundComponents(p1, min, max) {
  return new PIXI.Point(boundScalar(p1.x, min, max), boundScalar(p1.y, min, max))
}

export function boundsCenter(bounds) {
    return new PIXI.Point(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2)
}

export function boundsRelativeCenter(bounds) {
    return new PIXI.Point(bounds.width / 2, bounds.height / 2)
}

export function boundsTopLeft(bounds) {
    return new PIXI.Point(bounds.x, bounds.y)
}

export function boundsBottomRight(bounds) {
    return new PIXI.Point(bounds.x + bounds.width, bounds.y + bounds.height)
}

export function invert(point) {
  return scl(point, -1)
}

export function setCenter(object, centerObject, newCenter) {
    // this.graphics.pivot.copy(this.graphicsCenter);
    let newPosition = object.parent.toLocal(newCenter, centerObject);
    centerObject.position.copy(invert(newCenter));
    object.position.copy(newPosition);
}

export function calculateBoundsAspectRatio(bounds) {
  return bounds.width / bounds.height;
}

// export function scaleBoundsToFitInside(bounds, otherBounds) {
//   const ratio = calculateBoundsAspectRatio()
// }
