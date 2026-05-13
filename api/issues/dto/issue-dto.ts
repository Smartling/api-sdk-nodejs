import { IssueSeverityLevel } from "../enums/issue-severity-level";
import { IssueState } from "../enums/issue-state";
import { IssueSubType } from "../enums/issue-sub-type";
import { IssueType } from "../enums/issue-type";
import { IssueStringDto } from "./issue-string-dto";

export interface IssueDto {
    answered: boolean;
    createdDate: string;
    lastCommentDate?: string;
    issueSeverityLevelCode: IssueSeverityLevel;
    issueStateCode: IssueState;
    issueSubTypeCode: IssueSubType;
    issueText: string;
    issueTextModifiedDate?: string;
    issueTypeCode: IssueType;
    issueUid: string;
    projectId: string;
    accountUid: string;
    issueNumber: number;
    reportedByUserUid: string;
    resolvedByUserUid?: string;
    assigneeUserUid?: string;
    resolvedDate?: string;
    reopened: boolean;
    reopenedByUserUid?: string;
    reopenedDate?: string;
    string: IssueStringDto;
    issueCommentsCount: number;
}
