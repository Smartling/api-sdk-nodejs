import { BaseParameters } from "../../parameters/index";

export class ListProjectsParameters extends BaseParameters {
    setProjectNameFilter(projectNameFilter: string): ListProjectsParameters {
        this.set("projectNameFilter", projectNameFilter);
        return this;
    }

    setIncludeArchived(includeArchived: boolean): ListProjectsParameters {
        this.set("includeArchived", includeArchived);
        return this;
    }

    setOffset(offset: number): ListProjectsParameters {
        if (offset >= 0) {
            this.set("offset", offset);
        }
        return this;
    }

    setLimit(limit: number): ListProjectsParameters {
        if (limit > 0) {
            this.set("limit", limit);
        }
        return this;
    }

    setProjectTypeCode(projectTypeCode: string): ListProjectsParameters {
        this.set("projectTypeCode", projectTypeCode);
        return this;
    }

    setProjectTypeCodes(projectTypeCodes: Array<string>): ListProjectsParameters {
        this.set("projectTypeCodes", projectTypeCodes);
        return this;
    }
}
