import { BaseParameters } from "../../parameters";
import { SmartlingException } from "../../exception";

export class ListProjectTagsParameters extends BaseParameters {
    setTagMask(tagMask: string): ListProjectTagsParameters {
        this.set("tagMask", tagMask);

        return this;
    }

    setLimit(limit: number): ListProjectTagsParameters {
        if (limit < 0 || limit > 100) {
            throw new SmartlingException("Limit must be between 0 and 100");
        }

        this.set("limit", limit);

        return this;
    }

    setOffset(offset: number): ListProjectTagsParameters {
        if (offset < 0) {
            throw new SmartlingException("Offset must be non-negative");
        }

        this.set("offset", offset);

        return this;
    }
}
