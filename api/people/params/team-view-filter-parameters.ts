import { BaseParameters } from "../../parameters/index";
import { PeopleSortProperty } from "./people-sort-property";
import { PeopleSortDirection } from "./people-sort-direction";
import { PeopleRole } from "./people-role";

class TeamViewFilterParameters extends BaseParameters {
    public setKeyword(keyword: string): TeamViewFilterParameters {
        this.set("keyword", keyword);
        return this;
    }

    public setUserUids(userUids: string[]): TeamViewFilterParameters {
        this.set("userUids", userUids);
        return this;
    }

    public setPending(pending: boolean): TeamViewFilterParameters {
        this.set("pending", pending);
        return this;
    }

    public setUserRoles(userRoles: PeopleRole[]): TeamViewFilterParameters {
        this.set("userRoles", userRoles);
        return this;
    }

    public setProjectUids(projectUids: string[]): TeamViewFilterParameters {
        this.set("projectUids", projectUids);
        return this;
    }

    public setAgencyUid(agencyUid: string): TeamViewFilterParameters {
        this.set("agencyUid", agencyUid);
        return this;
    }

    public setSourceLocales(sourceLocales: string[]): TeamViewFilterParameters {
        this.set("sourceLocales", sourceLocales);
        return this;
    }

    public setTargetLocales(targetLocales: string[]): TeamViewFilterParameters {
        this.set("targetLocales", targetLocales);
        return this;
    }

    public setWorkflowUid(workflowUid: string): TeamViewFilterParameters {
        this.set("workflowUid", workflowUid);
        return this;
    }

    public setWorkflowStepUids(workflowStepUids: string[]): TeamViewFilterParameters {
        this.set("workflowStepUids", workflowStepUids);
        return this;
    }

    public setLimit(limit: number): TeamViewFilterParameters {
        this.set("limit", limit);
        return this;
    }

    public setOffsetToken(offsetToken: string): TeamViewFilterParameters {
        this.set("offsetToken", offsetToken);
        return this;
    }

    public setSortProperty(sortProperty: PeopleSortProperty): TeamViewFilterParameters {
        this.set("sortProperty", sortProperty);
        return this;
    }

    public setSortDirection(sortDirection: PeopleSortDirection): TeamViewFilterParameters {
        this.set("sortDirection", sortDirection);
        return this;
    }
}

export { TeamViewFilterParameters };
