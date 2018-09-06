import { IntervalTypes } from "./types";

export function intervalToMilliseconds(interval: IntervalTypes): number {
    switch (interval) {
        case "second":
            return 1000;
        case "minute":
            return 60 * intervalToMilliseconds("second");
        case "hour":
            return 60 * intervalToMilliseconds("minute");
        case "day":
            return 24 * intervalToMilliseconds("hour");
        case "week":
            return 7 * intervalToMilliseconds("day");
        default:
            throw new Error(`Invalid "interval" value ${interval}`);
    }
}
