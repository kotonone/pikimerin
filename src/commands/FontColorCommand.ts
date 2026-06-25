import { createCommand } from "./Command";

export const fontColor = createCommand(
    {
        color: {
            type: "string",
            required: false,
        },
    },
    (context, { color }) => {
        if (color?.includes("-gradient")) {
            context.text.style.color = "";
            context.text.style.backgroundImage = color;
            context.text.style.backgroundClip = "text";
            context.text.style.webkitTextFillColor = "transparent";
        } else {
            context.text.style.color = color ?? "";
            context.text.style.backgroundImage = "";
            context.text.style.backgroundClip = "";
            context.text.style.webkitTextFillColor = "";
        }
    },
    ["color"],
);
