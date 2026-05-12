import { BaseIssuesFilterParameters } from "./base-issues-filter-parameters";
import { SmartlingException } from "../../exception";
import { IssueSortByDto } from "../dto/issue-sort-by-dto";

export class FindProjectIssuesParameters
    extends BaseIssuesFilterParameters<FindProjectIssuesParameters> {
    setLimit(limit: number): FindProjectIssuesParameters {
        if (limit < 0) {
            throw new SmartlingException("Limit must be non-negative");
        }
        this.set("limit", limit);
        return this;
    }

    setOffset(offset: number): FindProjectIssuesParameters {
        if (offset < 0) {
            throw new SmartlingException("Offset must be non-negative");
        }
        this.set("offset", offset);
        return this;
    }

    setSortBy(sortBy: IssueSortByDto): FindProjectIssuesParameters {
        this.set("sortBy", sortBy);
        return this;
    }
}
