import { createCommand } from "./Command";

export const fontFamily = createCommand(
    {
        family: {
            type: "string",
            required: false,
        },
    },
    (context, { family }) => {
        context.text.style.fontFamily = family ?? "";
    },
    ["family"],
);
