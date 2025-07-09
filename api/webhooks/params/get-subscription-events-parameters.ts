import { BaseParameters } from "../../parameters";

export class GetSubscriptionEventsParameters extends BaseParameters {
    setLimit(limit: number) {
        if (limit > 0) {
            this.set("limit", limit);
        }

        return this;
    }
}
