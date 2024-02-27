import { BaseParameters } from "../../parameters";

export class GetLocalesParameters extends BaseParameters {
    public setLocaleIds(localeIds: Array<string>): GetLocalesParameters {
        this.set("localeIds", localeIds);

        return this;
    }

    public setSupportedOnly(supportedOnly: boolean): GetLocalesParameters {
        this.set("supportedOnly", supportedOnly);

        return this;
    }
}
