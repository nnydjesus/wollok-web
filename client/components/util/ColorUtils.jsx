import tinycolor from "tinycolor2"

function randomBetween(min, max) {
    return Math.floor((Math.random() * (max - min + 1)) + min);
}

export function fromRGBToInt(r, g, b) {
    if(r.r) {
        fromRGBMapToInt(r);
    }
    return (r << 16) + (g << 8) + b
}

export function fromRGBMapToInt(map) {
    return fromRGBToInt(map.r, map.g, map.b)
}

export function fromTinyColorToInt(tinyColor) {
    return parseInt("0x" + tinyColor.toHex());
}

export function randomColor(options) {
    options = Object.assign(options, {
        minR: 0, maxR: 255, minG: 0, maxG: 255, minB: 0, maxB: 255
    });
    return fromRGBToInt(
        randomBetween(options.minR, options.maxR),
        randomBetween(options.minG, options.maxG),
        randomBetween(options.minB, options.maxB));
}

export function fromIntToRGB(intColor) {
    return {
        r: parseInt(intColor >> 16),
        g: parseInt((intColor & 0xFFFF) >> 8),
        b: parseInt(intColor & 0xFF)
    }
}

export function lum(intOrR, g, b) {
    let r = intOrR;
    if (!g && !b) {
        const color = fromIntToRGB(intOrR)
        r = color.r;
        g = color.g;
        b = color.b;
    }
    const rp = r / 255;
    const rg = g / 255;
    const rb = b / 255;
    return (Math.max(rp, rg, rb) + Math.min(rp, rg, rb)) / 2
}

export let Colors = {
    sectionDefaultColor: fromRGBToInt(180, 180, 180),
    sectionLineDefaultColor: fromRGBToInt(225, 225, 225),
    sectionTextDefaultColor: fromRGBToInt(255, 255, 255),
    sectionTextOutlineColor: fromRGBToInt(20, 20, 20), // TODO remove - unused
    seatDefaultColor: fromRGBToInt(210, 244, 100)
};
