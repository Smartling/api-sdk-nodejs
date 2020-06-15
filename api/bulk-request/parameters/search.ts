import BaseParameters from "../../parameters";

export class Search extends BaseParameters {
    constructor() {
        super();

        this.setOffset(0);
        this.setLimit(100);
        this.set("orderBy", "ASC");
    }

    public setOffset(offset: number): this {
        this.set("offset", offset);

        return this;
    };

    public setLimit(limit: number): this {
        this.set("limit", limit);

        return this;
    };

    public setSort(sort: string): this {
        this.set("sortBy", sort);

        return this;
    };

    public setFilter(filter: object): this {
        this.set("filter", filter);

        return this;
    };
}
