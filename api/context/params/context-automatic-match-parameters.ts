import { BaseParameters } from "../../parameters/index";
import { SmartlingException } from "../../exception/index";

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
        if (!Number.isInteger(overrideContextOlderThanDays) || overrideContextOlderThanDays < 0) {
            throw new SmartlingException("Override context older than days should be a non-negative integer");
        }
        this.set("overrideContextOlderThanDays", overrideContextOlderThanDays);

        return this;
    }
}
