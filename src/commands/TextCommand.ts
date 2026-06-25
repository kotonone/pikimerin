import { createCommand } from "./Command";

export const text = createCommand(
    {
        text: {
            type: "string",
            required: true,
        },
    },
    (context, { text }) => context.text.addText(text),
    ["text"],
);
