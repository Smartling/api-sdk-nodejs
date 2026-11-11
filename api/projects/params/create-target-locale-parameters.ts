import { BaseParameters } from "../../parameters/index";

export class CreateTargetLocaleParameters extends BaseParameters {
    setLocaleId(localeId: string): CreateTargetLocaleParameters {
        this.set("localeId", localeId);
        return this;
    }

    setDefaultWorkflowUid(defaultWorkflowUid: string): CreateTargetLocaleParameters {
        this.set("defaultWorkflowUid", defaultWorkflowUid);
        return this;
    }
}
