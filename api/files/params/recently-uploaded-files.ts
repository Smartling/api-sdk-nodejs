import { SmartlingException } from "../../exception";
import { BaseParameters } from "../../parameters/index";

export class RecentlyUploadedFilesParameters extends BaseParameters {
    setUriMask(uriMask: string): RecentlyUploadedFilesParameters {
        this.set("uriMask", uriMask);

        return this;
    }

    setLimit(limit: number): RecentlyUploadedFilesParameters {
        if (limit > 0) {
            this.set("limit", limit);

            return this;
        }

        throw new SmartlingException("Limit must be > 0");
    }

    setOffset(offset: number): RecentlyUploadedFilesParameters {
        if (offset >= 0) {
            this.set("offset", offset);

            return this;
        }

        throw new SmartlingException("Offset must be >= 0");
    }
}
