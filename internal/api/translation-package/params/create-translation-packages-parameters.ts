import BaseParameters from "../../parameters";

export class CreateTranslationPackagesParameters extends BaseParameters {
	public setTitle(title: string): CreateTranslationPackagesParameters {
		this.set("title", title);

		return this;
	}

	public setCustomData(customData: any): CreateTranslationPackagesParameters {
		this.set("customData", customData);

		return this;
	}

	public setPackageKey(packageKey: any): CreateTranslationPackagesParameters {
		this.set("packageKey", packageKey);

		return this;
	}
}
