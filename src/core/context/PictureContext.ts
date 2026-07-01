import { Layer } from "../picture/Layer";

/** ピクチャに関連する環境情報クラス */
export class PictureContext {
    /** ピクチャ描画キャンバス */
    public readonly canvas: HTMLCanvasElement;
    /** レイヤー */
    public readonly layers: Map<string, Layer>;

    public constructor() {
        this.canvas = document.createElement("canvas");
        this.layers = new Map();
    }

    /** JSON 形式にシリアライズします。 */
    public toJSON() {
        return {
            layers: Object.fromEntries(this.layers.entries()),
        };
    }
}
