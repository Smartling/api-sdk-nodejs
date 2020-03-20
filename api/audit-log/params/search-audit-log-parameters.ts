import BaseParameters from "../../parameters";

class SearchAuditLogParams extends BaseParameters {
    constructor() {
        super();

        this.setOffset(0);
        this.setLimit(10);
        this.setStartTime("now()");
        this.setEndTime("now() - 30d");
        this.setSort("time:desc");
    }

    public setQuery(query: string): SearchAuditLogParams {
        this.set("q", query);

        return this;
    };

    public setOffset(offset: number): SearchAuditLogParams {
        this.set("offset", offset);

        return this;
    };

    public setLimit(limit: number): SearchAuditLogParams {
        this.set("limit", limit);

        return this;
    };

    public setStartTime(startTime: string): SearchAuditLogParams {
        this.set("startTime", startTime);

        return this;
    };

    public setEndTime(endTime: string): SearchAuditLogParams {
        this.set("endTime", endTime);

        return this;
    };

    public setSort(sort: string): SearchAuditLogParams {
        this.set("sort", sort);

        return this;
    };
}

export default SearchAuditLogParams;
