import { AbortablePromise } from "../utils/Promise";

export function pause(): AbortablePromise<void> {
    return new AbortablePromise<void>((resolve, _reject, signal) => {
        signal.onabort = () => resolve();
    });
}
