import { BaseParameters } from "../../parameters/index";

export class AuthorizeJobParameters extends BaseParameters {
    constructor(parameters: Record<string, unknown> = {}) {
        super(parameters);

        // if no localeWorkflows are set, the request's body should be empty
        // https://api-reference.smartling.com/#tag/Jobs/operation/authorizeJob
    }

    addLocaleWorkflows(targetLocaleId: string, workflowUid: string): AuthorizeJobParameters {
        const { localeWorkflows } = this.parameters;
        const newLocaleWorkflow = { targetLocaleId, workflowUid };

        this.set("localeWorkflows",
            localeWorkflows?.concat(newLocaleWorkflow) || [newLocaleWorkflow]
        );

        return this;
    }
}
