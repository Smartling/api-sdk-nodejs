import { BaseParameters } from "../../parameters/index";
import { LocaleWorkflowDto } from "../dto/locale-workflow-dto";

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

    setRushJob(rushJob: boolean): CreateBatchParameters {
        this.set("rushJob", rushJob);

        return this;
    }

    addFileUri(fileUri: string): CreateBatchParameters {
        this.parameters.fileUris = this.parameters.fileUris.concat(fileUri);

        return this;
    }

    addLocaleWorkflow(localeWorkflow: LocaleWorkflowDto): CreateBatchParameters {
        this.parameters.localeWorkflows = this.parameters.localeWorkflows.concat(localeWorkflow);

        return this;
    }
}
