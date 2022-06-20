import { BaseParameters } from "../../parameters/index";

export class CancelJobParameters extends BaseParameters {
    setReason(reason: string): CancelJobParameters {
        this.set("reason", reason);

        return this;
    }
}
