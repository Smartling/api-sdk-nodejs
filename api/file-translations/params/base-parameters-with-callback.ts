import { BaseParameters } from "../../parameters";
import { FtsCallback, FtsCallbackMethod, FtsCallbackUserData } from "./fts-callback-parameter";

export class BaseParametersWithCallback extends BaseParameters {
    setCallback(
        url: string,
        httpMethod?: FtsCallbackMethod,
        userData?: FtsCallbackUserData | string
    ): this;
    setCallback(callback: FtsCallback): this;

    setCallback(
        urlOrCallback: FtsCallback | string,
        httpMethod: FtsCallbackMethod = FtsCallbackMethod.POST,
        userData?: FtsCallbackUserData | string
    ): this {
        if (typeof urlOrCallback === "string") {
            this.parameters.callback = {
                url: urlOrCallback,
                httpMethod,
                userData: (typeof userData === "string") ? userData : JSON.stringify(userData)
            };
        } else {
            const { userData: callbackUserData } = urlOrCallback;
            this.parameters.callback = (typeof callbackUserData === "string") ? urlOrCallback : {
                ...urlOrCallback,
                userData: JSON.stringify(callbackUserData)
            };
        }
        return this;
    }
}
