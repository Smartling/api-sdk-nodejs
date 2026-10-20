import { BaseParameters } from "../../parameters/index";

export class ModifyEstimateReportTagsParameters extends BaseParameters {
    setTags(tags: Array<string>): ModifyEstimateReportTagsParameters {
        this.set("tags", tags);

        return this;
    }
}
