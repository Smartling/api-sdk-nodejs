import { BaseParameters } from "../../parameters/index";
import { validateOverrideContextOlderThanDays } from "./validate-override-context-older-than-days";

export class ContextAutomaticMatchParameters extends BaseParameters {
    setFileUri(fileUri: string): ContextAutomaticMatchParameters {
        this.set("contentFileUri", fileUri);

        return this;
    }

    setStringHashcodes(stringHashcodes: string[]): ContextAutomaticMatchParameters {
        this.set("stringHashcodes", stringHashcodes);

        return this;
    }

    setOverrideContextOlderThanDays(
        overrideContextOlderThanDays: number
    ): ContextAutomaticMatchParameters {
        validateOverrideContextOlderThanDays(overrideContextOlderThanDays);
        this.set("overrideContextOlderThanDays", overrideContextOlderThanDays);

        return this;
    }
}
