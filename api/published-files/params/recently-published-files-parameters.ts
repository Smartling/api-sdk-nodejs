import { BaseParameters } from "../../parameters";
import { SmartlingException } from "../../exception";

export class RecentlyPublishedFilesParameters extends BaseParameters {
    public setPublishedAfterDate(publishedAfterDate: Date): RecentlyPublishedFilesParameters {
        this.set("publishedAfter", `${publishedAfterDate.toISOString().split(".")[0]}Z`);

        return this;
    }

    setLimit(limit: number): RecentlyPublishedFilesParameters {
        if (limit > 0) {
            this.set("limit", limit);

            return this;
        }

        throw new SmartlingException("Limit must be > 0");
    }

    setOffset(offset: number): RecentlyPublishedFilesParameters {
        if (offset >= 0) {
            this.set("offset", offset);

            return this;
        }

        throw new SmartlingException("Offset must be >= 0");
    }

    setFileUris(fileUris: Array<string>): RecentlyPublishedFilesParameters {
        this.set("fileUris[]", fileUris);

        return this;
    }

    setLocaleIds(localeIds: Array<string>): RecentlyPublishedFilesParameters {
        this.set("localeIds[]", localeIds);

        return this;
    }
}
