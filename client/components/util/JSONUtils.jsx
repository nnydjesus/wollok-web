import * as PIXI from "pixi.js"

export function serializePoint(point) {
    return {x: point.x, y: point.y};
}

export function deserializePoint(targetPoint, jsonPoint) {
    if (jsonPoint) {
        targetPoint.x = jsonPoint.x;
        targetPoint.y = jsonPoint.y;
        return targetPoint;
    } else {
        jsonPoint = targetPoint;
        const result = new PIXI.Point();
        result.x = jsonPoint.x;
        result.y = jsonPoint.y;
        return result;
    }
}
