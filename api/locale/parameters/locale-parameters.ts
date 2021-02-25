import BaseParameters from "../../parameters";

export class LocaleParameters extends BaseParameters {
	constructor(property?: string) {
		super({property});
	}

	public setLocaleIds(localeIds: string[]): LocaleParameters {
		this.set("localeIds", localeIds);

		return this;
	};
}
