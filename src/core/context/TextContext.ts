import { AbortablePromise, wait } from "../../utils/Promise";
import { AmeriScriptError } from "../Error";

/** テキストの中間表現 */
export type TextIR = {
    /** 中間表現タイプ */
    type: "character";
    /** 文字 */
    character: string;
    /** 中間表現で上書きするスタイル */
    style?: string;
} | {
    /** 中間表現タイプ */
    type: "linebreak";
};

/**
 * 指定されたテキストを中間表現に変換します。
 * @param text 変換するテキスト
 */
function splitTextToIR(text: string): TextIR[] {
    const result: TextIR[] = [];
    for (const char of text) {
        if (char === "\n") {
            result.push({ type: "linebreak" });
        } else {
            result.push({ type: "character", character: char });
        }
    }
    return result;
}

/**
 * テキストに関連する環境情報クラス。
 *
 * 中間表現を利用して DOM にレンダリングを行います。
 */
export class TextContext {
    /** テキストコンテナ */
    public readonly container: ParentNode;

    /** 現在使用されているテキストの CSS 定義 */
    public style: CSSStyleDeclaration;

    /** 文字速度 [文字/秒] */
    public speed: number;

    /** 中間表現の配列 */
    public ir: TextIR[] = [];

    public constructor(speed: number = 20) {
        const container = document.createElement("div");
        container.style.display = "inline";
        container.style.lineHeight = "1";
        this.container = container;
        this.style = document.createElement("span").style;
        this.speed = speed;
    }

    /**
     * 指定されたテキストを追加します。
     * @param text 追加するテキスト
     */
    public addText(text: string) {
        const irs = splitTextToIR(text);
        for (const ir of irs) {
            if (ir.type === "character") {
                ir.style = this.style.cssText;
            }
        }

        return this.addIR(irs);
    }

    /**
     * 指定された中間表現を追加します。
     * @param irs 追加する中間表現
     */
    public addIR(irs: TextIR[]) {
        this.ir.push(...irs);

        const elements = irs.map(ir => {
            if (ir.type === "character") {
                const element = document.createElement("span");
                element.textContent = ir.character;
                element.style.cssText = ir.style ?? this.style.cssText;
                return element;
            } else if (ir.type === "linebreak") {
                const element = document.createElement("br");
                return element;
            } else {
                throw new AmeriScriptError(`Unknown IR type: ${JSON.stringify(ir)}`);
            }
        });

        // NOTE: 非表示状態ですべての要素を追加
        for (const element of elements) {
            element.style.verticalAlign = "top";
            element.style.transition = "none";
            element.setAttribute("data-hide", "");
        }
        this.container.append(...elements);

        // NOTE: 順番に要素を表示する
        return new AbortablePromise<void>(async (_resolve, _reject, signal) => {
            // NOTE: 中止されたときはトランジションを全解除
            signal.addEventListener("abort", () => {
                for (const element of elements) {
                    element.style.transition = "none";
                    element.removeAttribute("data-hide");
                }
            });

            await new Promise(resolve => requestAnimationFrame(resolve));

            for (const element of elements) {
                if (signal.aborted) break;

                element.style.transition = "";
                element.removeAttribute("data-hide");
                await wait(1000 / this.speed).abortWith(signal);
            }
        });
    }

    /**
     * テキストをクリアします。
     */
    public clear() {
        this.ir = [];
        this.container.textContent = "";
    }

    /** JSON 形式にシリアライズします。 */
    public toJSON() {
        return {
            style: this.style.cssText,
            speed: this.speed,
            ir: this.ir,
        };
    }
}
