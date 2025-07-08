import { BaseParameters } from "../../parameters";

export class GetSubscriptionEventsParameters extends BaseParameters {
    setLimit(limit: number): GetSubscriptionEventsParameters {
        if (limit > 0) {
            this.set("limit", limit);
        }

        return this;
    }
}
