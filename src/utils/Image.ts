const _length = document.createElementNS("http://www.w3.org/2000/svg", "circle").r.baseVal;

/**
 * SVG 要素のアニメーションされた長さを、指定された単位の数値で取得します。
 * @param length アニメーションされた長さ
 * @param unitType 単位
 */
export function getLengthAs(length: SVGLength, unitType: number = SVGLength.SVG_LENGTHTYPE_PX): number {
    _length.newValueSpecifiedUnits(length.unitType, length.value);
    _length.convertToSpecifiedUnits(unitType);
    return _length.valueInSpecifiedUnits;
}

/**
 * {@link CanvasImageSource} の幅と高さを取得します。
 * @param source 画像
 */
export function getBounds(source: CanvasImageSource): { width: number; height: number; } {
    if (source instanceof VideoFrame) {
        return {
            width: source.displayWidth,
            height: source.displayHeight,
        };
    } else if (source instanceof SVGImageElement) {
        return {
            width: getLengthAs(source.width.animVal),
            height: getLengthAs(source.height.animVal),
        };
    } else {
        return {
            width: source.width,
            height: source.height,
        };
    }
}
