import { BaseParameters } from "../../parameters";
import { SmartlingException } from "../../exception";

const MAX_JOB_UIDS = 200;

export class ContentAssignmentsParameters extends BaseParameters {
    setJobUids(jobUids: Array<string>): ContentAssignmentsParameters {
        if (jobUids.length > MAX_JOB_UIDS) {
            throw new SmartlingException(`jobUids must contain at most ${MAX_JOB_UIDS} items`);
        }
        this.set("jobUids", jobUids);
        return this;
    }
}
