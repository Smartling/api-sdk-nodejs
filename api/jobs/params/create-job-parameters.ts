import { CreateUpdateJobBaseParameters } from "./create-update-job-base-parameters";

export class CreateJobParameters extends CreateUpdateJobBaseParameters<CreateJobParameters> {
    setTargetLocaleIds(targetLocaleIds: string[]): CreateJobParameters {
        this.set("targetLocaleIds", targetLocaleIds);

        return this;
    }
}
