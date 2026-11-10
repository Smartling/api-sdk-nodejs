import { BaseParameters } from "../../parameters/index";

export class RenameProjectParameters extends BaseParameters {
    setProjectName(projectName: string): RenameProjectParameters {
        this.set("projectName", projectName);
        return this;
    }
}
