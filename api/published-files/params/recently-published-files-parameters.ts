import BaseParameters from "../../parameters";

export class RecentlyPublishedFilesParameters extends BaseParameters {
    public setPublishedAfterDate(publishedAfterDate: Date): RecentlyPublishedFilesParameters {
        this.set("publishedAfter", publishedAfterDate.toISOString().split('.')[0] + "Z");

        return this;
    };

    setLimit(limit: number) {
        this.set("limit", limit);

        return this;
    }

    setOffset(offset: number) {
        this.set("offset", offset);

        return this;
    }

    setFileUris(fileUris: Array<string>) {
        this.set("fileUris[]", fileUris);

        return this;
    }

    setLocaleIds(localeIds: Array<string>) {
        this.set("localeIds[]", localeIds);

        return this;
    }
}
