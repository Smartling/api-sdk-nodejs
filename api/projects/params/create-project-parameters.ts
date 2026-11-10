import { BaseParameters } from "../../parameters/index";

export class CreateProjectParameters extends BaseParameters {
    setProjectName(projectName: string): CreateProjectParameters {
        this.set("projectName", projectName);
        return this;
    }

    setProjectTypeCode(projectTypeCode: string): CreateProjectParameters {
        this.set("projectTypeCode", projectTypeCode);
        return this;
    }

    setOriginalLocaleId(originalLocaleId: string): CreateProjectParameters {
        this.set("originalLocaleId", originalLocaleId);
        return this;
    }

    setTranslationLocaleIds(translationLocaleIds: Array<string>): CreateProjectParameters {
        this.set("translationLocaleIds", translationLocaleIds);
        return this;
    }

    setSiteUrl(siteURL: string): CreateProjectParameters {
        this.set("siteURL", siteURL);
        return this;
    }

    setPackageUid(packageUid: string): CreateProjectParameters {
        this.set("packageUid", packageUid);
        return this;
    }

    setLqaDefaultWorkflowUid(lqaDefaultWorkflowUid: string): CreateProjectParameters {
        this.set("lqaDefaultWorkflowUid", lqaDefaultWorkflowUid);
        return this;
    }

    setLqaNewWorkflowName(lqaNewWorkflowName: string): CreateProjectParameters {
        this.set("lqaNewWorkflowName", lqaNewWorkflowName);
        return this;
    }

    setLqaSchemaUid(lqaSchemaUid: string): CreateProjectParameters {
        this.set("lqaSchemaUid", lqaSchemaUid);
        return this;
    }

    setDefaultWorkflowUid(defaultWorkflowUid: string): CreateProjectParameters {
        this.set("defaultWorkflowUid", defaultWorkflowUid);
        return this;
    }
}
