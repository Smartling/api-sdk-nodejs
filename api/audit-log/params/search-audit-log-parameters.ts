import BaseParameters from "../../parameters";
import SmartlingException from "../../exception";
import OrderEnum from "./order-enum";

class SearchAuditLogParams extends BaseParameters {
    constructor() {
        super();

        this.setOffset(0);
        this.setLimit(10);
        this.setStartTime("now()");
        this.setEndTime("now() - 30d");
        this.setSort("time", OrderEnum.ORDER_DESC);
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

    public setSort(field: string, order: OrderEnum): SearchAuditLogParams {
        if (
            order !== OrderEnum.ORDER_DESC &&
            order !== OrderEnum.ORDER_ASC
        ) {
            throw new SmartlingException(`Allowed orders are: ${OrderEnum.ORDER_DESC}, ${OrderEnum.ORDER_ASC}`);
        }

        this.set("sort", `${field}:${order}`);

        return this;
    };
}

export default SearchAuditLogParams;