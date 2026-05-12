import { IssueState } from "../enums/issue-state";

export interface IssueStateDto {
    issueStateCode: IssueState;
    reopened: boolean;
}
