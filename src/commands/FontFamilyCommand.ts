import type { TextContext } from "../core/Context";

export function fontFamily(context: TextContext, family: string): void {
    context.style.fontFamily = family;
}
