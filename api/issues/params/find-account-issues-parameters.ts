import { BaseIssuesFilterParameters } from "./base-issues-filter-parameters";
import { SmartlingException } from "../../exception";
import { IssueSortByDto } from "../dto/issue-sort-by-dto";

export class FindAccountIssuesParameters extends BaseIssuesFilterParameters {
    setProjectIds(projectIds: Array<string>): this {
        this.set("projectIds", projectIds);
        return this;
    }

    setLimit(limit: number): this {
        if (limit < 0) {
            throw new SmartlingException("Limit must be non-negative");
        }
        this.set("limit", limit);
        return this;
    }

    setOffset(offset: number): this {
        if (offset < 0) {
            throw new SmartlingException("Offset must be non-negative");
        }
        this.set("offset", offset);
        return this;
    }

    setSortBy(sortBy: IssueSortByDto): this {
        this.set("sortBy", sortBy);
        return this;
    }
}
