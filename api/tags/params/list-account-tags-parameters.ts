import { BaseParameters } from "../../parameters";
import { SmartlingException } from "../../exception";

export class ListAccountTagsParameters extends BaseParameters {
    setProjectIds(projectIds: Array<string>): ListAccountTagsParameters {
        if (projectIds && projectIds.length > 1000) {
            throw new SmartlingException("Project IDs array must not exceed 1000 items");
        }

        this.set("projectIds", projectIds);

        return this;
    }

    setTagMask(tagMask: string): ListAccountTagsParameters {
        this.set("tagMask", tagMask);

        return this;
    }

    setLimit(limit: number): ListAccountTagsParameters {
        if (limit < 1 || limit > 1500) {
            throw new SmartlingException("Limit must be between 1 and 1500");
        }

        this.set("limit", limit);

        return this;
    }

    setOffset(offset: number): ListAccountTagsParameters {
        if (offset < 0) {
            throw new SmartlingException("Offset must be non-negative");
        }

        this.set("offset", offset);

        return this;
    }
}
