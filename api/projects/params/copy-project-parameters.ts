import { BaseParameters } from "../../parameters/index";

export class CopyProjectParameters extends BaseParameters {
    setProjectName(projectName: string): CopyProjectParameters {
        this.set("projectName", projectName);
        return this;
    }

    setTargetLocaleIds(targetLocaleIds: Array<string>): CopyProjectParameters {
        this.set("targetLocaleIds", targetLocaleIds);
        return this;
    }
}
