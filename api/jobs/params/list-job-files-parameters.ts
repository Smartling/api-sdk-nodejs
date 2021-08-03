import { BaseParameters } from "../../parameters";

export class ListJobFilesParameters extends BaseParameters {
    setLimit(limit: number) {
        if (limit > 0) {
            this.set("limit", limit);
        }

        return this;
    }

    setOffset(offset: number) {
        if (offset > 0) {
            this.set("offset", offset);
        }

        return this;
    }
}
