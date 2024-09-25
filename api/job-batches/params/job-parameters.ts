import { BaseParameters } from "../../parameters";
import { SmartlingException } from "../../exception";

export class JobParameters extends BaseParameters {
    setDescription(description: string): this {
        if (description.length >= 2000) {
            throw new SmartlingException("Job description should be less than 2000 characters.");
        }

        this.set("description", description);

        return this;
    }
    setTargetLocaleIds(targetLocaleIds: string[]): this {
        this.set("targetLocaleIds", targetLocaleIds);

        return this;
    }
    setMode(mode: "CREATE_NEW" | "REUSE_EXISTING"): this {
        this.set("mode", mode);

        return this;
    }
    setSalt(salt: "ORDINAL" | "TIMESTAMP" | "RANDOM_ALPHANUMERIC"): this {
        this.set("salt", salt);

        return this;
    }
    setTimeZoneName(timeZoneName: string): this {
        this.set("timeZoneName", timeZoneName);

        return this;
    }
}
