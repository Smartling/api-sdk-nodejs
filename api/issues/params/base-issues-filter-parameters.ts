import { BaseParameters } from "../../parameters";
import { SmartlingException } from "../../exception";
import { IssueSeverityLevel } from "../enums/issue-severity-level";
import { IssueState } from "../enums/issue-state";
import { IssueSubType } from "../enums/issue-sub-type";
import { IssueType } from "../enums/issue-type";
import { IssueWatchingState } from "../enums/issue-watching-state";
import { JobFilterDto } from "../dto/job-filter-dto";
import { StringFilterDto } from "../dto/string-filter-dto";

export abstract class BaseIssuesFilterParameters<
    T extends BaseIssuesFilterParameters<T>
> extends BaseParameters {
    setCreatedDateBefore(date: string): T {
        this.set("createdDateBefore", date);
        return this as unknown as T;
    }

    setCreatedDateAfter(date: string): T {
        this.set("createdDateAfter", date);
        return this as unknown as T;
    }

    setResolvedDateBefore(date: string): T {
        this.set("resolvedDateBefore", date);
        return this as unknown as T;
    }

    setResolvedDateAfter(date: string): T {
        this.set("resolvedDateAfter", date);
        return this as unknown as T;
    }

    setAnswered(answered: boolean): T {
        this.set("answered", answered);
        return this as unknown as T;
    }

    setReopened(reopened: boolean): T {
        this.set("reopened", reopened);
        return this as unknown as T;
    }

    setHasComments(hasComments: boolean): T {
        this.set("hasComments", hasComments);
        return this as unknown as T;
    }

    setIssueSeverityLevelCodes(codes: Array<IssueSeverityLevel>): T {
        this.set("issueSeverityLevelCodes", codes);
        return this as unknown as T;
    }

    setIssueStateCodes(codes: Array<IssueState>): T {
        this.set("issueStateCodes", codes);
        return this as unknown as T;
    }

    setIssueSubTypeCodes(codes: Array<IssueSubType>): T {
        this.set("issueSubTypeCodes", codes);
        return this as unknown as T;
    }

    setIssueTypeCodes(codes: Array<IssueType>): T {
        this.set("issueTypeCodes", codes);
        return this as unknown as T;
    }

    setIssueWatchingStateCode(code: IssueWatchingState): T {
        this.set("issueWatchingStateCode", code);
        return this as unknown as T;
    }

    setReportedByUserUid(uid: string): T {
        this.set("reportedByUserUid", uid);
        return this as unknown as T;
    }

    setAssigneeUserUid(uid: string): T {
        this.set("assigneeUserUid", uid);
        return this as unknown as T;
    }

    setIssueNumbers(numbers: Array<number>): T {
        if (numbers && numbers.length > 1000) {
            throw new SmartlingException("Issue numbers array must not exceed 1000 items");
        }
        this.set("issueNumbers", numbers);
        return this as unknown as T;
    }

    setJobFilter(jobFilter: JobFilterDto): T {
        if (jobFilter && jobFilter.jobUids && jobFilter.jobUids.length > 1000) {
            throw new SmartlingException("Job filter jobUids array must not exceed 1000 items");
        }
        this.set("jobFilter", jobFilter);
        return this as unknown as T;
    }

    setStringFilter(stringFilter: StringFilterDto): T {
        this.set("stringFilter", stringFilter);
        return this as unknown as T;
    }
}
