import { BaseParameters } from "../../parameters/index";

export class JobProgressParameters extends BaseParameters {
    setTargetLocaleId(targetLocaleId: string): JobProgressParameters {
        this.set("targetLocaleId", targetLocaleId);

        return this;
    }
}
