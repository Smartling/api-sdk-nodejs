import BaseParameters from "../../parameters";

export class RecentlyPublishedFilesParameters extends BaseParameters {
    public setPublishedAfterDate(publishedAfterDate: Date): RecentlyPublishedFilesParameters {
        this.set("publishedAfter", publishedAfterDate.toISOString().split('.')[0] + "Z");

        return this;
    };
}
