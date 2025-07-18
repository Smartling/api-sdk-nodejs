import { SubscriptionEvent } from "../params/subscription-event";
import { SubscriptionRequestHeader } from "../params/subscription-request-header";

interface SubscriptionDto {
    subscriptionUid: string;
    subscriptionName: string;
    subscriptionUrl: string;
    accountUid: string;
    enabled: boolean;
    userUid: string;
    description: string | null;
    createdDate: string;
    requestHeaders: SubscriptionRequestHeader[];
    events: SubscriptionEvent[];
    projectUids: string[];
}

export { SubscriptionDto };
