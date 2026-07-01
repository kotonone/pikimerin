import { UnknownLayerError } from "../core/Error";
import { createCommand } from "./Command";

export const pictureHide = createCommand(
    {
        name: {
            type: "string",
            required: true,
        },
    },
    (context, { name }) => {
        const layer = context.picture.layers.get(name);
        if (!layer) throw new UnknownLayerError(name);

        layer.hide(); // TODO: duration
    },
    ["name"],
);
