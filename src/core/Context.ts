import { TextContext } from "./context/TextContext";
import { PictureContext } from "./context/PictureContext";

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
        this.text = new TextContext(20);
        this.picture = new PictureContext();
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

    /** JSON 形式にシリアライズします。 */
    public toJSON() {
        return {
            text: this.text.toJSON(),
            picture: this.picture.toJSON(),
            data: this.data,
            stack: this.stack,
        };
    }
}
