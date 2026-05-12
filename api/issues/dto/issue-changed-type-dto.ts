import { IssueSubType } from "../enums/issue-sub-type";
import { IssueType } from "../enums/issue-type";

export interface IssueChangedTypeDto {
    issueTypeCode: IssueType;
    issueSubTypeCode: IssueSubType;
    localeId?: string;
}
