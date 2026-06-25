import { createCommand } from "./Command";

export const fontSize = createCommand(
    {
        size: {
            type: "string",
            required: false,
        },
    },
    (context, { size }) => {
        context.text.style.fontSize = size ?? "";
    },
    ["size"],
)
