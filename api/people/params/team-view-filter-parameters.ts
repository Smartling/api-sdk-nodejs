import { BaseParameters } from "../../parameters/index";
import { PeopleSortProperty } from "./people-sort-property";
import { PeopleSortDirection } from "./people-sort-direction";
import { PeopleRole } from "./people-role";

export class TeamViewFilterParameters extends BaseParameters {
    setKeyword(keyword: string): TeamViewFilterParameters {
        this.set("keyword", keyword);

        return this;
    }

    setUserUids(userUids: Array<string>): TeamViewFilterParameters {
        this.set("userUids", userUids);

        return this;
    }

    setPending(pending: boolean): TeamViewFilterParameters {
        this.set("pending", pending);

        return this;
    }

    setUserRoles(userRoles: Array<PeopleRole>): TeamViewFilterParameters {
        this.set("userRoles", userRoles);

        return this;
    }

    setProjectUids(projectUids: Array<string>): TeamViewFilterParameters {
        this.set("projectUids", projectUids);

        return this;
    }

    setAgencyUid(agencyUid: string): TeamViewFilterParameters {
        this.set("agencyUid", agencyUid);

        return this;
    }

    setSourceLocales(sourceLocales: Array<string>): TeamViewFilterParameters {
        this.set("sourceLocales", sourceLocales);

        return this;
    }

    setTargetLocales(targetLocales: Array<string>): TeamViewFilterParameters {
        this.set("targetLocales", targetLocales);

        return this;
    }

    setWorkflowUid(workflowUid: string): TeamViewFilterParameters {
        this.set("workflowUid", workflowUid);

        return this;
    }

    setWorkflowStepUids(workflowStepUids: Array<string>): TeamViewFilterParameters {
        this.set("workflowStepUids", workflowStepUids);

        return this;
    }

    setLimit(limit: number): TeamViewFilterParameters {
        this.set("limit", limit);

        return this;
    }

    setOffsetToken(offsetToken: string): TeamViewFilterParameters {
        this.set("offsetToken", offsetToken);

        return this;
    }

    setSortProperty(sortProperty: PeopleSortProperty): TeamViewFilterParameters {
        this.set("sortProperty", sortProperty);

        return this;
    }

    setSortDirection(sortDirection: PeopleSortDirection): TeamViewFilterParameters {
        this.set("sortDirection", sortDirection);

        return this;
    }
}
