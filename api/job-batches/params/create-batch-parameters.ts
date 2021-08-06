import { BaseParameters } from "../../parameters/index";

export class CreateBatchParameters extends BaseParameters {
    constructor(parameters: Record<string, unknown> = {}) {
        super(parameters);

        this.set("fileUris", []);
        this.set("localeWorkflows", []);
    }

    setTranslationJobUid(uid: string): CreateBatchParameters {
        this.set("translationJobUid", uid);

        return this;
    }

    setAuthorize(authorize: boolean): CreateBatchParameters {
        this.set("authorize", authorize);

        return this;
    }

    addFileUri(fileUri: string): CreateBatchParameters {
        this.parameters.fileUris = this.parameters.fileUris.concat(fileUri);

        return this;
    }

    addLocaleWorkflows(targetLocaleId: string, workflowUid: string): CreateBatchParameters {
        this.parameters.localeWorkflows = this.parameters.localeWorkflows.concat({
            targetLocaleId,
            workflowUid
        });

        return this;
    }
}
