import { TextContext } from "../core/Context";

export function fontColor(context: TextContext, color: string): void {
    if (color.includes("-gradient")) {
        context.style.color = "";
        context.style.backgroundImage = color;
        context.style.backgroundClip = "text";
        context.style.webkitTextFillColor = "transparent";
    } else {
        context.style.color = color;
        context.style.backgroundImage = "";
        context.style.backgroundClip = "";
        context.style.webkitTextFillColor = "";
    }
}
