import { wait } from "../utils/Promise";
import { createCommand } from "./Command";

export const sleep = createCommand(
    {
        duration: {
            type: "string",
            required: true,
        },
    },
    (_, { duration }) => {
        let duration_;
        if (/^\d+ ?(ms|msecs?|milliseconds?)$/.test(duration)) {
            duration_ = parseFloat(duration) / 1000;
        } else if (/^\d+ ?(s|secs?|seconds?)$/.test(duration)) {
            duration_ = parseFloat(duration);
        } else if (/^\d+ ?(m|mins?|minutes?)$/.test(duration)) {
            duration_ = parseFloat(duration) * 60;
        } else if (/^\d+ ?(h|hrs?|hours?)$/.test(duration)) {
            duration_ = parseFloat(duration) * 60 * 60;
        } else if (/^\d+ ?(d|days?)$/.test(duration)) {
            duration_ = parseFloat(duration) * 60 * 60 * 24;
        } else {
            throw new Error("Invalid duration: " + duration);
        }

        return wait(duration_ * 1000);
    },
    ["duration"],
);

