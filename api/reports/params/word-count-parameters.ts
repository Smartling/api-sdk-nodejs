import { formatDate } from "./date-formatter";
import { BaseParameters } from "../../parameters";

export class WordCountParameters extends BaseParameters {
    public setStartDate(startDate: Date): WordCountParameters {
        this.set("startDate", formatDate(startDate));
        return this;
    }

    public setEndDate(endDate: Date): WordCountParameters {
        this.set("endDate", formatDate(endDate));
        return this;
    }

    public setAccountUid(accountUid: string): WordCountParameters {
        this.set("accountUid", accountUid);
        return this;
    }

    public setProjectIds(projectIds: Array<string>): WordCountParameters {
        this.set("projectIds", projectIds);
        return this;
    }

    public setJobUids(jobUids: Array<string>): WordCountParameters {
        this.set("jobUids", jobUids);
        return this;
    }

    public setAgencyUid(agencyUid: string): WordCountParameters {
        this.set("agencyUid", agencyUid);
        return this;
    }

    public setUserUids(userUids: Array<string>): WordCountParameters {
        this.set("userUids", userUids);
        return this;
    }

    public setTargetLocaleIds(targetLocaleIds: Array<string>): WordCountParameters {
        this.set("targetLocaleIds", targetLocaleIds);
        return this;
    }

    public setWorkflowStepTypes(workflowStepTypes: Array<string>): WordCountParameters {
        this.set("workflowStepTypes", workflowStepTypes);
        return this;
    }

    public setFields(fields: string): WordCountParameters {
        this.set("fields", fields);
        return this;
    }

    public setLimit(limit: number): WordCountParameters {
        this.set("limit", limit);
        return this;
    }

    public setOffset(offset: number): WordCountParameters {
        this.set("offset", offset);
        return this;
    }
}
