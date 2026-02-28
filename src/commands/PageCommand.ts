import { TextContext } from "../core/Context";

export function page(context: TextContext): void {
    context.container.textContent = "";
}
