import { BaseParameters } from "../../parameters/index";

export class ListJobFilesParameters extends BaseParameters {
    setLimit(limit: number): BaseParameters {
        if (limit > 0) {
            this.set("limit", limit);
        }

        return this;
    }

    setOffset(offset: number): ListJobFilesParameters {
        if (offset >= 0) {
            this.set("offset", offset);
        }

        return this;
    }
}
