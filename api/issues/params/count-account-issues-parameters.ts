import { BaseIssuesFilterParameters } from "./base-issues-filter-parameters";

export class CountAccountIssuesParameters extends BaseIssuesFilterParameters {
    setProjectIds(projectIds: Array<string>): this {
        this.set("projectIds", projectIds);
        return this;
    }
}
