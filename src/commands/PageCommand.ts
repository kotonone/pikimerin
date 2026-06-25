import { createCommand } from "./Command";

export const page = createCommand(
    {},
    (context) => {
        context.text.container.textContent = "";
    },
    [],
);
