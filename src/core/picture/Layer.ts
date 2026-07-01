/** レイヤーのサイズとして、そのソース画像のサイズを利用する */
export const LAYER_SIZE_AUTO = -1;
/** レイヤーのサイズとして、キャンバスのサイズを利用する */
export const LAYER_SIZE_MAX = -2;

/** ピクチャレイヤー */
export class Layer {
    /** レイヤー名 */
    public readonly name: string;
    /** 描画する画像ファイルへのパス */
    public source: string | null;
    /** X座標（px） */
    public x: number;
    /** Y座標（px） */
    public y: number;
    /** 幅（px） */
    public width: number;
    /** 高さ（px） */
    public height: number;
    /** 合成モード */
    public blendMode: GlobalCompositeOperation;

    /** レイヤーの可視状態 */
    #visible: boolean;

    /**
     * @param source 描画する画像
     * @param x X座標
     * @param y Y座標
     * @param width 幅
     * @param height 高さ
     * @param name レイヤー名
     * @param blendMode 合成モード
     */
    public constructor(
        source: string | null = null,
        x: number = 0,
        y: number = 0,
        width: number = LAYER_SIZE_AUTO,
        height: number = LAYER_SIZE_AUTO,
        name: string = "Layer",
        blendMode: GlobalCompositeOperation = "source-over"
    ) {
        this.name = name;
        this.#visible = true;
        this.source = source;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.blendMode = blendMode;
    }

    /** レイヤーの可視状態 */
    public get visible(): boolean {
        return this.#visible;
    }
    /** レイヤーを表示します。 */
    public show(): void {
        this.#visible = true;
    }
    /** レイヤーを非表示にします。 */
    public hide(): void {
        this.#visible = false;
    }
}
