import { BaseParameters } from "../../parameters";
import { FtsCallback } from "./fts-callback-parameter";

export class BaseParametersWithCallback extends BaseParameters {
    setCallback(callback: FtsCallback): this {
        this.parameters.callback = callback;
        return this;
    }
}
