import { BaseParameters } from "../../parameters/index";
import { ProjectTypeGroupCode } from "./project-type-group-code";

export class GetAccountProjectTypesParameters extends BaseParameters {
    setProjectTypeGroupCode(
        projectTypeGroupCode: ProjectTypeGroupCode
    ): GetAccountProjectTypesParameters {
        this.set("projectTypeGroupCode", projectTypeGroupCode);
        return this;
    }
}
