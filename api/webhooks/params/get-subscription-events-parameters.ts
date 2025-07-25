import { BaseParameters } from "../../parameters";
import { SubscriptionEventAttemptStatus } from "../dto/subscription-event-attempt-status";

export class GetSubscriptionEventsParameters extends BaseParameters {
    setLimit(limit: number): this {
        this.set("limit", limit);
        return this;
    }

    setScrollId(scrollId: string): this {
        this.set("scrollId", scrollId);
        return this;
    }

    setAttemptStatus(attemptStatus: SubscriptionEventAttemptStatus): this {
        this.set("attemptStatus", attemptStatus);
        return this;
    }

    setCreatedDateBefore(createdDateBefore: Date): this {
        this.set("createdDateBefore", GetSubscriptionEventsParameters.prepareDateParameter(createdDateBefore));
        return this;
    }

    setCreatedDateAfter(createdDateAfter: Date): this {
        this.set("createdDateAfter", GetSubscriptionEventsParameters.prepareDateParameter(createdDateAfter));
        return this;
    }

    setEventTypes(eventTypes: string[]): this {
        this.set("eventTypes", eventTypes);
        return this;
    }

    private static prepareDateParameter(date: Date): string {
        return `${date.toISOString().split(".")[0]}Z`;
    }
}
