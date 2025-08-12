import { BaseParameters } from "../../parameters/index";

export class AddStringsToJobParameters extends BaseParameters {
    setHashcodes(hashcodes: string[]): AddStringsToJobParameters {
        this.set("hashcodes", hashcodes);
        return this;
    }

    setMoveEnabled(moveEnabled: boolean): AddStringsToJobParameters {
        this.set("moveEnabled", moveEnabled);
        return this;
    }

    setTargetLocaleIds(targetLocaleIds: string[]): AddStringsToJobParameters {
        this.set("targetLocaleIds", targetLocaleIds);
        return this;
    }
}
