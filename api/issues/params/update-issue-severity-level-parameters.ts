import { BaseParameters } from "../../parameters";
import { IssueSeverityLevel } from "../enums/issue-severity-level";

export class UpdateIssueSeverityLevelParameters extends BaseParameters {
    setIssueSeverityLevel(level: IssueSeverityLevel): UpdateIssueSeverityLevelParameters {
        this.set("issueSeverityLevelCode", level);
        return this;
    }
}
