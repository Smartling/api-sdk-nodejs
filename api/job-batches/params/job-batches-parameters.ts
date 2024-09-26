import { BaseParameters } from "../../parameters";
import { SmartlingException } from "../../exception";
import { JobBatchesParametersMode } from "../dto/job-batches-parameters-mode";
import { JobBatchesParametersSalt } from "../dto/job-batches-parameters-salt";

export class JobBatchesParameters extends BaseParameters {
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
    setMode(mode: JobBatchesParametersMode): this {
        this.set("mode", mode);

        return this;
    }
    setSalt(salt: JobBatchesParametersSalt): this {
        this.set("salt", salt);

        return this;
    }
    setTimeZoneName(timeZoneName: string): this {
        this.set("timeZoneName", timeZoneName);

        return this;
    }
}
