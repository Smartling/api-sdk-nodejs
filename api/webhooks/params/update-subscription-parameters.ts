import { CreateUpdateSubscriptionParameters } from "./create-update-subscription-parameters";
import { SubscriptionEvent } from "./subscription-event";

export class UpdateSubscriptionParameters extends CreateUpdateSubscriptionParameters {
    constructor(
        subscriptionName: string,
        subscriptionUrl: string,
        events: SubscriptionEvent[],
        enabled: boolean
    ) {
        super(
            subscriptionName,
            subscriptionUrl,
            events
        );

        this.set("enabled", enabled);
    }
}
