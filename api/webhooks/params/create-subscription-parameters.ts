import { CreateUpdateSubscriptionParameters } from "./create-update-subscription-parameters";

export class CreateSubscriptionParameters extends CreateUpdateSubscriptionParameters {
    setPayloadSecret(payloadSecret: string): this {
        this.set("payloadSecret", payloadSecret);

        return this;
    }
}
