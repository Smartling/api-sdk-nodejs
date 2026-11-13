import { SmartlingException } from "../../exception/index";

export function validateOverrideContextOlderThanDays(days: number): void {
    if (!Number.isInteger(days) || days < 0) {
        throw new SmartlingException("Override context older than days should be a non-negative integer");
    }
}
