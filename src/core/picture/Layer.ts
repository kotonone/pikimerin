import { getBounds } from "../../utils/Image";

/** ピクチャレイヤー */
export class Layer {
    /** レイヤー名 */
    public readonly name: string;
    /** レイヤーに描画する画像 */
    public source: CanvasImageSource | null;
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

    #visible: boolean;

    /**
     * @param source 描画画像
     * @param x X座標
     * @param y Y座標
     * @param width 幅
     * @param height 高さ
     * @param name レイヤー名
     * @param blendMode 合成モード
     */
    public constructor(
        source: CanvasImageSource | null = null,
        x: number = 0,
        y: number = 0,
        width: number = -1,
        height: number = -1,
        name: string = "Layer",
        blendMode: GlobalCompositeOperation = "source-over"
    ) {
        this.name = name;
        this.#visible = true;
        this.source = source;
        this.x = x;
        this.y = y;
        this.width = source && width < 0 ? getBounds(source).width : width;
        this.height = source && width < 0 ? getBounds(source).height : height;
        this.blendMode = blendMode;
    }

    /** このレイヤーをレンダリングする際の、画像ソースにおける位置・大きさを取得します。 */
    public get sourceBounds(): { x: number; y: number; width: number; height: number; } {
        if (!this.source) return { x: 0, y: 0, width: 0, height: 0 };
        const bounds = getBounds(this.source);
        const scale = Math.max(this.width / bounds.width, this.height / bounds.height);
        const displayWidth = bounds.width * scale;
        const displayHeight = bounds.height * scale;
        return {
            x: this.x - (displayWidth - this.width) / 2,
            y: this.y - (displayHeight - this.height) / 2,
            width: displayWidth,
            height: displayHeight,
        };
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
