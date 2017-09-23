import * as ColorUtils from './ColorUtils.jsx'


export function setColor(graphics, tinyColor) {
    graphics.beginFill(ColorUtils.fromTinyColorToInt(tinyColor), tinyColor.getAlpha());
}
