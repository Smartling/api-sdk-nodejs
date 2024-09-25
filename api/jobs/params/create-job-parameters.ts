import { UpdateJobParameters } from "./update-job-parameters";

export class CreateJobParameters extends UpdateJobParameters {
    setTargetLocaleIds(targetLocaleIds: string[]): this {
        this.set("targetLocaleIds", targetLocaleIds);

        return this;
    }
}
