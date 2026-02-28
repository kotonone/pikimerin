import { TextContext } from "../core/Context";
import { splitTextToElement } from "../utils/Parse";
import { AbortablePromise, wait } from "../utils/Promise";

export function text(context: TextContext, text: string): AbortablePromise<void> {
    const elements = splitTextToElement(text);

    // NOTE: 非表示状態ですべての要素を追加
    for (const element of elements) {
        element.style.cssText = context.style.cssText;
        element.style.verticalAlign = "top";
        element.style.transition = "none";
        element.setAttribute("data-hide", "");
    }
    context.container.append(...elements);

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
            await wait(1000 / context.speed).abortWith(signal);
        }
    });
}
