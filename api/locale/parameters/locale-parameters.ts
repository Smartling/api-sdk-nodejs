import BaseParameters from "../../parameters";

export class LocaleParameters extends BaseParameters {
	public setLocaleIds(localeIds: string[]): LocaleParameters {
		this.set("localeIds", localeIds);

		return this;
	};
}
