import type { PictureContext } from "../Context";

export class Renderer {
    readonly #context: Readonly<PictureContext>;
    #canvas: HTMLCanvasElement;
    #ctx: CanvasRenderingContext2D;

    public constructor(context: Readonly<PictureContext>) {
        this.#context = context;
        this.#canvas = context.canvas;
        const ctx = context.canvas.getContext("2d");
        if (!ctx) throw new Error("2Dコンテキストの取得に失敗しました");
        this.#ctx = ctx;
    }

    /** レンダリングを行います。 */
    public render() {
        const { layers } = this.#context;

        // NOTE: Canvas のサイズをコンテナに合わせる
        const rect = this.#canvas.getBoundingClientRect();
        this.#canvas.width = rect.width;
        this.#canvas.height = rect.height;

        // NOTE: 画面クリア
        this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

        for (const layer of layers) {
            if (!layer.visible || !layer.source) continue;

            this.#ctx.globalCompositeOperation = layer.blendMode;

            const sb = layer.sourceBounds;
            this.#ctx.drawImage(layer.source, sb.x, sb.y, sb.width, sb.height, layer.x, layer.y, layer.width, layer.height);
        }

        // NOTE: 合成モードをデフォルトに戻す
        this.#ctx.globalCompositeOperation = "source-over";
    }
}
