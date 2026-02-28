import { AbortablePromise, wait } from "../utils/Promise";

export function sleep(duration: string | number): AbortablePromise<void> {
    const isNumeric = (value: any): value is number => !isNaN(value);

    if (isNumeric(duration)) {
        duration = parseFloat(duration as any);
    } else {
        if (/^\d+ ?(ms|msecs?|milliseconds?)$/.test(duration)) {
            duration = parseFloat(duration) / 1000;
        } else if (/^\d+ ?(s|secs?|seconds?)$/.test(duration)) {
            duration = parseFloat(duration);
        } else if (/^\d+ ?(m|mins?|minutes?)$/.test(duration)) {
            duration = parseFloat(duration) * 60;
        } else if (/^\d+ ?(h|hrs?|hours?)$/.test(duration)) {
            duration = parseFloat(duration) * 60 * 60;
        } else if (/^\d+ ?(d|days?)$/.test(duration)) {
            duration = parseFloat(duration) * 60 * 60 * 24;
        } else {
            throw new Error("Invalid duration: " + duration);
        }
    }

    return wait(duration * 1000);
}
