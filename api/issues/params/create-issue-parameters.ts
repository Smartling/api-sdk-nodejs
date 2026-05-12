import { BaseParameters } from "../../parameters";
import { SmartlingException } from "../../exception";
import { IssueSeverityLevel } from "../enums/issue-severity-level";
import { IssueSubType } from "../enums/issue-sub-type";
import { IssueType } from "../enums/issue-type";
import { CreateIssueStringDto } from "../dto/create-issue-string-dto";

export class CreateIssueParameters extends BaseParameters {
    setIssueText(issueText: string): CreateIssueParameters {
        if (issueText && issueText.length > 4000) {
            throw new SmartlingException("Issue text length must not exceed 4000 characters");
        }
        this.set("issueText", issueText);
        return this;
    }

    setIssueType(issueType: IssueType): CreateIssueParameters {
        this.set("issueTypeCode", issueType);
        return this;
    }

    setIssueSubType(issueSubType: IssueSubType): CreateIssueParameters {
        this.set("issueSubTypeCode", issueSubType);
        return this;
    }

    setString(string: CreateIssueStringDto): CreateIssueParameters {
        this.set("string", string);
        return this;
    }

    setAssigneeUserUid(assigneeUserUid: string): CreateIssueParameters {
        this.set("assigneeUserUid", assigneeUserUid);
        return this;
    }

    setIssueSeverityLevel(level: IssueSeverityLevel): CreateIssueParameters {
        this.set("issueSeverityLevelCode", level);
        return this;
    }
}
