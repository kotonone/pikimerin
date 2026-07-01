import { Layer } from "../picture/Layer";

/** ピクチャに関連する環境情報クラス */
export class PictureContext {
    /** レイヤー */
    public readonly layers: Map<string, Layer>;

    public constructor() {
        this.layers = new Map();
    }

    /** JSON 形式にシリアライズします。 */
    public toJSON() {
        return {
            layers: Object.fromEntries(this.layers.entries()),
        };
    }
}
