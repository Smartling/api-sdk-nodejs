import { BaseParameters } from "../../parameters";
import { SmartlingException } from "../../exception";

export class UpdateIssueAssigneeParameters extends BaseParameters {
    setAssigneeUserUid(assigneeUserUid: string): UpdateIssueAssigneeParameters {
        if (!assigneeUserUid || assigneeUserUid.length === 0) {
            throw new SmartlingException("assigneeUserUid is required");
        }
        this.set("assigneeUserUid", assigneeUserUid);
        return this;
    }
}
