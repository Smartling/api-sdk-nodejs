import { BaseParameters } from "../../parameters/index";

export class RemoveStringsFromJobParameters extends BaseParameters {
    setHashcodes(hashcodes: string[]): RemoveStringsFromJobParameters {
        this.set("hashcodes", hashcodes);
        return this;
    }

    setTargetLocaleIds(targetLocaleIds: string[]): RemoveStringsFromJobParameters {
        this.set("targetLocaleIds", targetLocaleIds);
        return this;
    }
}
