import { createCommand } from "./Command";

export const pictureRemove = createCommand(
    {
        name: {
            type: "string",
            required: true,
        },
    },
    (context, { name }) => {
        context.picture.layers.delete(name);
    },
    ["name"],
);
