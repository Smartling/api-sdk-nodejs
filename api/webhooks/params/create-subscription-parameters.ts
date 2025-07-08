import { CreateUpdateSubscriptionParameters } from "./create-update-subscription-parameters";

export class CreateSubscriptionParameters
    extends CreateUpdateSubscriptionParameters<CreateSubscriptionParameters> {
    setPayloadSecret(payloadSecret: string): CreateSubscriptionParameters {
        this.set("payloadSecret", payloadSecret);

        return this;
    }
}
