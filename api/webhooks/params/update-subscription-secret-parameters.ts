import { BaseParameters } from "../../parameters";
import { SmartlingException } from "../../exception";

export class UpdateSubscriptionSecretParameters extends BaseParameters {
    constructor(payloadSecret: string) {
        super();

        if (!payloadSecret) {
            throw new SmartlingException("Payload secret is required.");
        }

        this.set("payloadSecret", payloadSecret);
    }
}
