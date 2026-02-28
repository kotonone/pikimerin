import { TextContext } from "../core/Context";

export function fontSize(context: TextContext, size: string): void {
    context.style.fontSize = size;
}
