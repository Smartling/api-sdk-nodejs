import { BaseParameters } from "../../parameters/index";

export class FindJobsByStringsParameters extends BaseParameters {
    setHashcodes(hashcodes: Array<string>): FindJobsByStringsParameters {
        this.set("hashcodes", hashcodes);

        return this;
    }

    setLocaleIds(localeIds: Array<string>): FindJobsByStringsParameters {
        this.set("localeIds", localeIds);

        return this;
    }
}
