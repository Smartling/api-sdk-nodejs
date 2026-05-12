import { BaseIssuesFilterParameters } from "./base-issues-filter-parameters";
import { SmartlingException } from "../../exception";
import { IssueSortByDto } from "../dto/issue-sort-by-dto";

export class FindAccountIssuesParameters
    extends BaseIssuesFilterParameters<FindAccountIssuesParameters> {
    setProjectIds(projectIds: Array<string>): FindAccountIssuesParameters {
        this.set("projectIds", projectIds);
        return this;
    }

    setLimit(limit: number): FindAccountIssuesParameters {
        if (limit < 0) {
            throw new SmartlingException("Limit must be non-negative");
        }
        this.set("limit", limit);
        return this;
    }

    setOffset(offset: number): FindAccountIssuesParameters {
        if (offset < 0) {
            throw new SmartlingException("Offset must be non-negative");
        }
        this.set("offset", offset);
        return this;
    }

    setSortBy(sortBy: IssueSortByDto): FindAccountIssuesParameters {
        this.set("sortBy", sortBy);
        return this;
    }
}
