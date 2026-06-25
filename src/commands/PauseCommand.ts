import { AbortablePromise } from "../utils/Promise";
import { createCommand } from "./Command";

export const pause = createCommand(
    {},
    () => new AbortablePromise<void>((resolve, _reject, signal) => {
        signal.onabort = () => resolve();
    }),
    [],
);
