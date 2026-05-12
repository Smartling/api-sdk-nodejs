import { BaseParameters } from "../../parameters";
import { IssueState } from "../enums/issue-state";

export class UpdateIssueStateParameters extends BaseParameters {
    setIssueState(state: IssueState): UpdateIssueStateParameters {
        this.set("issueStateCode", state);
        return this;
    }
}
