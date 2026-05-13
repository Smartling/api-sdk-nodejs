import { BaseParameters } from "../../parameters";
import { IssueSubType } from "../enums/issue-sub-type";
import { IssueType } from "../enums/issue-type";

export class UpdateIssueTypeParameters extends BaseParameters {
    setIssueType(issueType: IssueType): UpdateIssueTypeParameters {
        this.set("issueTypeCode", issueType);
        return this;
    }

    setIssueSubType(issueSubType: IssueSubType): UpdateIssueTypeParameters {
        this.set("issueSubTypeCode", issueSubType);
        return this;
    }

    setLocaleId(localeId: string): UpdateIssueTypeParameters {
        this.set("localeId", localeId);
        return this;
    }
}
