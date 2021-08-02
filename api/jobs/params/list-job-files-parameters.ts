import { BaseParameters } from "../../parameters";

export class ListJobFilesParameters extends BaseParameters {
    setLimit(limit) {
        if (limit > 0) {
            this.set("limit", limit);
        }

        return this;
    }

    setOffset(offset) {
        if (offset > 0) {
            this.set("offset", offset);
        }

        return this;
    }
}
