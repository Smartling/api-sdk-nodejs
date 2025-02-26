import { BaseParameters } from "../../parameters";
import { FtsCallback, FtsCallbackMethod, FtsCallbackUserData } from "./fts-callback-parameter";

export class BaseParametersWithCallback extends BaseParameters {
    setCallback(
        url: string,
        httpMethod?: FtsCallbackMethod,
        userData?: FtsCallbackUserData
    ): this;
    setCallback(callback: FtsCallback): this;

    setCallback(
        urlOrCallback: string | FtsCallback,
        httpMethod: FtsCallbackMethod = FtsCallbackMethod.POST,
        userData?: FtsCallbackUserData
    ): this {
        if (typeof urlOrCallback === "string") {
            this.parameters.callback = {
                url: urlOrCallback,
                httpMethod,
                userData
            };
        } else {
            this.parameters.callback = urlOrCallback;
        }
        return this;
    }
}
