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
        if (overrideContextOlderThanDays < 1) {
            throw new SmartlingException("Override context older than days should be a positive number");
        }
        this.set("overrideContextOlderThanDays", overrideContextOlderThanDays);

        return this;
    }
}
