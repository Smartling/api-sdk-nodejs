import { BaseParameters } from "../../parameters";
import { SmartlingException } from "../../exception";
import { IssueSeverityLevel } from "../enums/issue-severity-level";
import { IssueState } from "../enums/issue-state";
import { IssueSubType } from "../enums/issue-sub-type";
import { IssueType } from "../enums/issue-type";
import { IssueWatchingState } from "../enums/issue-watching-state";
import { JobFilterDto } from "../dto/job-filter-dto";
import { StringFilterDto } from "../dto/string-filter-dto";

export abstract class BaseIssuesFilterParameters extends BaseParameters {
    setCreatedDateBefore(date: string): this {
        this.set("createdDateBefore", date);
        return this;
    }

    setCreatedDateAfter(date: string): this {
        this.set("createdDateAfter", date);
        return this;
    }

    setResolvedDateBefore(date: string): this {
        this.set("resolvedDateBefore", date);
        return this;
    }

    setResolvedDateAfter(date: string): this {
        this.set("resolvedDateAfter", date);
        return this;
    }

    setAnswered(answered: boolean): this {
        this.set("answered", answered);
        return this;
    }

    setReopened(reopened: boolean): this {
        this.set("reopened", reopened);
        return this;
    }

    setHasComments(hasComments: boolean): this {
        this.set("hasComments", hasComments);
        return this;
    }

    setIssueSeverityLevelCodes(codes: Array<IssueSeverityLevel>): this {
        this.set("issueSeverityLevelCodes", codes);
        return this;
    }

    setIssueStateCodes(codes: Array<IssueState>): this {
        this.set("issueStateCodes", codes);
        return this;
    }

    setIssueSubTypeCodes(codes: Array<IssueSubType>): this {
        this.set("issueSubTypeCodes", codes);
        return this;
    }

    setIssueTypeCodes(codes: Array<IssueType>): this {
        this.set("issueTypeCodes", codes);
        return this;
    }

    setIssueWatchingStateCode(code: IssueWatchingState): this {
        this.set("issueWatchingStateCode", code);
        return this;
    }

    setReportedByUserUid(uid: string): this {
        this.set("reportedByUserUid", uid);
        return this;
    }

    setAssigneeUserUid(uid: string): this {
        this.set("assigneeUserUid", uid);
        return this;
    }

    setIssueNumbers(numbers: Array<number>): this {
        if (numbers && numbers.length > 1000) {
            throw new SmartlingException("Issue numbers array must not exceed 1000 items");
        }
        this.set("issueNumbers", numbers);
        return this;
    }

    setJobFilter(jobFilter: JobFilterDto): this {
        if (jobFilter && jobFilter.jobUids && jobFilter.jobUids.length > 1000) {
            throw new SmartlingException("Job filter jobUids array must not exceed 1000 items");
        }
        this.set("jobFilter", jobFilter);
        return this;
    }

    setStringFilter(stringFilter: StringFilterDto): this {
        this.set("stringFilter", stringFilter);
        return this;
    }
}
