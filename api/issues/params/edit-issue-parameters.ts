import { BaseParameters } from "../../parameters";
import { SmartlingException } from "../../exception";

export class EditIssueParameters extends BaseParameters {
    setIssueText(issueText: string): EditIssueParameters {
        if (issueText && issueText.length > 4000) {
            throw new SmartlingException("Issue text length must not exceed 4000 characters");
        }
        this.set("issueText", issueText);
        return this;
    }
}
