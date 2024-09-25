import { JobParameters } from "./job-parameters";

export class CreateJobParameters extends JobParameters {
    setTargetLocaleIds(targetLocaleIds: string[]): this {
        this.set("targetLocaleIds", targetLocaleIds);

        return this;
    }
}
