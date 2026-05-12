import { BaseIssuesFilterParameters } from "./base-issues-filter-parameters";

export class CountAccountIssuesParameters
    extends BaseIssuesFilterParameters<CountAccountIssuesParameters> {
    setProjectIds(projectIds: Array<string>): CountAccountIssuesParameters {
        this.set("projectIds", projectIds);
        return this;
    }
}
