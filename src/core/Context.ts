import { Layer } from "./picture/Layer";

/** シナリオの再生時における環境情報 */
export class Context {
    /** テキストコンテキスト */
    public text: TextContext;

    /** ピクチャコンテキスト */
    public picture: PictureContext;

    /** ユーザーデータ */
    public data: Record<string, string | number | boolean | undefined | null>;

    /** プログラムカウンタのスタック */
    private stack: number[];

    public constructor() {
        const textContainer = document.createElement("div");
        this.text = {
            container: textContainer,
            style: document.createElement("span").style,
            speed: 20,
        };
        textContainer.style.display = "inline";
        textContainer.style.lineHeight = "1";

        this.picture = {
            canvas: document.createElement("canvas"),
            layers: [],
        };

        this.data = {};
        this.stack = [0];
    }

    /** プログラムカウンタ */
    public get pc(): number {
        return this.stack[this.stack.length - 1] ?? 0;
    }
    public set pc(value: number) {
        if (this.stack.length === 0) this.stack.push(0);
        this.stack[this.stack.length - 1] = value;
    }

    public toJSON() {
        return {
            text: {
                style: this.text.style.all,
                speed: this.text.speed,
            },
            picture: {
                layers: this.picture.layers,
            },
            data: this.data,
            stack: this.stack,
        };
    }
}

/** テキストが要求するコンテキスト */
export interface TextContext {
    /** テキストコンテナ */
    container: ParentNode;

    /** テキストの CSS 定義 */
    style: CSSStyleDeclaration;

    /** 文字速度 [文字/秒] */
    speed: number;
}

/** ピクチャが要求するコンテキスト */
export interface PictureContext {
    /** ピクチャ描画キャンバス */
    canvas: HTMLCanvasElement;

    /** レイヤー */
    layers: Layer[];
}
