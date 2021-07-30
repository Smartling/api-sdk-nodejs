import BaseParameters from "../../parameters";
import SmartlingException from "../../exception";
import { OrderEnum } from "./order-enum";

export class SearchAuditLogParameters extends BaseParameters {
    constructor() {
        super();

        this.setOffset(0);
        this.setLimit(10);
        this.setStartTime("now()");
        this.setEndTime("now() - 30d");
        this.setSort("time", OrderEnum.ORDER_DESC);
    }

    public setQuery(query: string): SearchAuditLogParameters {
        this.set("q", query);

        return this;
    };

    public setOffset(offset: number): SearchAuditLogParameters {
        this.set("offset", offset);

        return this;
    };

    public setLimit(limit: number): SearchAuditLogParameters {
        this.set("limit", limit);

        return this;
    };

    public setStartTime(startTime: string): SearchAuditLogParameters {
        this.set("startTime", startTime);

        return this;
    };

    public setEndTime(endTime: string): SearchAuditLogParameters {
        this.set("endTime", endTime);

        return this;
    };

    public setSort(field: string, order: OrderEnum): SearchAuditLogParameters {
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
