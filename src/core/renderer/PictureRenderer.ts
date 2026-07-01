import { getBounds } from "../../utils/Image";
import { Assets } from "../Assets";
import { PictureContext } from "../context/PictureContext";
import { UnsupportedError } from "../Error";
import { LAYER_SIZE_AUTO, LAYER_SIZE_MAX } from "../picture/Layer";

/** ピクチャを Canvas 要素に描画するクラス */
export class PictureRenderer {
    readonly #context: Readonly<PictureContext>;

    /** ピクチャ描画キャンバス */
    readonly #canvas: HTMLCanvasElement;
    /** ネイティブの描画コンテキスト */
    readonly #rendering: CanvasRenderingContext2D;

    readonly #assets: Readonly<Assets>;

    public constructor(context: Readonly<PictureContext>, assets: Readonly<Assets>) {
        this.#context = context;

        this.#canvas = context.canvas;
        const renderingContext = this.#canvas.getContext("2d");
        if (!renderingContext) throw new UnsupportedError();
        this.#rendering = renderingContext;

        this.#assets = assets;
    }

    /**
     * レンダリングを行います。
     * @param deltaTime 前回のレンダリングからの経過時間（ミリ秒）
     */
    public render(deltaTime: number) {
        // NOTE: Canvas のサイズをコンテナに合わせる
        const rect = this.#canvas.getBoundingClientRect();
        this.#canvas.width = rect.width;
        this.#canvas.height = rect.height;

        // NOTE: 画面クリア
        this.#rendering.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

        for (const layer of this.#context.layers.values()) {
            if (!layer.visible || !layer.source) continue;

            // NOTE: ソースを取得
            const source = this.#assets.get(layer.source, "image");
            if (!source) continue;

            // NOTE: 描画範囲を取得
            const { width: sourceWidth, height: sourceHeight } = getBounds(source);
            if (sourceWidth <= 0 || sourceHeight <= 0) continue;
            const width =
                layer.width === LAYER_SIZE_AUTO ? sourceWidth :
                layer.width === LAYER_SIZE_MAX ? this.#canvas.width :
                layer.width;
            const height =
                layer.height === LAYER_SIZE_AUTO ? sourceHeight :
                layer.height === LAYER_SIZE_MAX ? this.#canvas.height :
                layer.height;
            if (width <= 0 || height <= 0) continue;

            // NOTE: 合成モードを設定して描画
            this.#rendering.globalCompositeOperation = layer.blendMode;
            this.#rendering.drawImage(source, 0, 0, sourceWidth, sourceHeight, layer.x, layer.y, width, height);
        }

        // NOTE: 合成モードをデフォルトに戻す
        this.#rendering.globalCompositeOperation = "source-over";
    }
}
