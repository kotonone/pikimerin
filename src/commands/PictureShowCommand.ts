import { UnknownLayerError } from "../core/Error";
import { createCommand } from "./Command";

export const pictureShow = createCommand(
    {
        name: {
            type: "string",
            required: true,
        },
    },
    (context, { name }) => {
        const layer = context.picture.layers.get(name);
        if (!layer) throw new UnknownLayerError(name);

        layer.show(); // TODO: duration
    },
    ["name"],
);
