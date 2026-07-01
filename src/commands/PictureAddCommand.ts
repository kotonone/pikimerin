import { UnknownLayerError } from "../core/Error";
import { Layer, LAYER_SIZE_AUTO, LAYER_SIZE_MAX } from "../core/picture/Layer";
import { createCommand } from "./Command";

export const pictureAdd = createCommand(
    {
        name: {
            type: "string",
            required: true,
        },
        file: {
            type: "string",
            required: true,
        },
        x: {
            type: "number",
            required: false,
        },
        y: {
            type: "number",
            required: false,
        },
        width: {
            type: "string",
            required: false,
        },
        height: {
            type: "string",
            required: false,
        },
        blend: {
            type: "string",
            required: false,
        },
    },
    (context, { name, file, x, y, width, height, blend }) => {
        if (context.picture.layers.has(name)) throw new UnknownLayerError(name);

        const w = width === "auto" ? LAYER_SIZE_AUTO :
            width === "max" ? LAYER_SIZE_MAX :
            parseInt(width ?? "");
        const h = height === "auto" ? LAYER_SIZE_AUTO :
            height === "max" ? LAYER_SIZE_MAX :
            parseInt(height ?? "");

        const layer = new Layer(file, x, y, w, h, name, blend as GlobalCompositeOperation);
        context.picture.layers.set(name, layer);
    },
    ["name", "file"],
);
