import { createCommand } from "./Command";

export const fontSize = createCommand(
    {
        size: {
            type: "string",
            required: true,
        },
    },
    (context, { size }) => {
        context.text.style.fontSize = size;
    },
    ["size"],
)
