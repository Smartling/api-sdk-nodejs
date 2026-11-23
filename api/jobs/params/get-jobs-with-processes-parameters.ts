import { BaseParameters } from "../../parameters/index";
import { SmartlingException } from "../../exception/index";

const MIN_JOB_UIDS = 1;
const MAX_JOB_UIDS = 500;

export class GetJobsWithProcessesParameters extends BaseParameters {
    setTranslationJobUids(translationJobUids: Array<string>): GetJobsWithProcessesParameters {
        if (translationJobUids.length < MIN_JOB_UIDS || translationJobUids.length > MAX_JOB_UIDS) {
            throw new SmartlingException(
                `Expected between ${MIN_JOB_UIDS} and ${MAX_JOB_UIDS} translation job uids, got ${translationJobUids.length}`
            );
        }

        this.set("translationJobUids", translationJobUids);

        return this;
    }
}
