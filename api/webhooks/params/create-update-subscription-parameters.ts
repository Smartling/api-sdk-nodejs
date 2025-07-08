import { BaseParameters } from "../../parameters";
import { SmartlingException } from "../../exception";
import { SubscriptionEvent } from "./subscription-event";
import { SubscriptionRequestHeader } from "./subscription-request-header";

const MAX_EVENTS_SIZE = 1000;
const MAX_SUBSCRIPTION_HEADERS_SIZE = 20;
const MAX_PROJECT_UIDS_SIZE = 10;

export abstract class CreateUpdateSubscriptionParameters<
    T extends CreateUpdateSubscriptionParameters<T>
> extends BaseParameters {
    constructor(
        subscriptionName: string,
        subscriptionUrl: string,
        events: SubscriptionEvent[]
    ) {
        super();

        if (!subscriptionName) {
            throw new SmartlingException("Subscription name is required.");
        }

        if (!subscriptionUrl) {
            throw new SmartlingException("Subscription url is required.");
        }

        if (!events.length) {
            throw new SmartlingException("At least one event is required.");
        }

        if (events.length > MAX_EVENTS_SIZE) {
            throw new SmartlingException(`The request contains too many events: ${events.length}. Maximum allowed events number is ${MAX_EVENTS_SIZE}.`);
        }

        this.set("subscriptionName", subscriptionName);
        this.set("subscriptionUrl", subscriptionUrl);
        this.set("events", events);
    }

    setDescription(description: string): T {
        this.set("description", description);

        return this as unknown as T;
    }

    setRequestHeaders(requestHeaders: SubscriptionRequestHeader[]): T {
        if (!requestHeaders.length) {
            throw new SmartlingException("At least one subscription header is required.");
        }

        if (requestHeaders.length > MAX_SUBSCRIPTION_HEADERS_SIZE) {
            throw new SmartlingException(`The request contains too many subscription headers: ${requestHeaders.length}. Maximum allowed subscription headers number is ${MAX_SUBSCRIPTION_HEADERS_SIZE}.`);
        }

        this.set("requestHeaders", requestHeaders);
        return this as unknown as T;
    }

    setProjectUids(projectUids: string[]): T {
        if (!projectUids.length) {
            throw new SmartlingException("At least one project uid is required.");
        }

        if (projectUids.length > MAX_PROJECT_UIDS_SIZE) {
            throw new SmartlingException(`The request contains too many project uids: ${projectUids.length}. Maximum allowed project uids number is ${MAX_PROJECT_UIDS_SIZE}.`);
        }
        this.set("projectUids", projectUids);

        return this as unknown as T;
    }
}
