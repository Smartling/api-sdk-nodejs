import { BaseParameters } from "../../parameters";

export class GetRecentlyPublishedFilesParameters extends BaseParameters {
    setPublishedAfter(publishedAfter: string): GetRecentlyPublishedFilesParameters {
        this.set("publishedAfter", publishedAfter);

        return this;
    }

    setFileUris(fileUris: Array<string>): GetRecentlyPublishedFilesParameters {
        this.set("fileUris", fileUris);

        return this;
    }

    setLocaleIds(localeIds: Array<string>): GetRecentlyPublishedFilesParameters {
        this.set("localeIds", localeIds);

        return this;
    }

    setOffset(offset: number): GetRecentlyPublishedFilesParameters {
        this.set("offset", offset);

        return this;
    }

    setLimit(limit: number): GetRecentlyPublishedFilesParameters {
        this.set("limit", limit);

        return this;
    }
}
