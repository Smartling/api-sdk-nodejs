import {StateEnum} from "./state-enum";
import SmartlingException from "../../exception";
import BaseParameters from "../../parameters";

export class UpdateTranslationPackagesParameters extends BaseParameters {
	public setState(state: StateEnum): UpdateTranslationPackagesParameters {
		if (!Object.values(StateEnum).includes(state)) {
			throw new SmartlingException(`Allowed state values are: ${Object.values(StateEnum).join(', ')}`);
		}

		this.set("state", state);

		return this;
	}

	public setVersion(version: number): UpdateTranslationPackagesParameters {
		this.set("version", version);

		return this;
	}

	public setLastErrorMessage(lastErrorMessage: string): UpdateTranslationPackagesParameters {
		this.set("lastErrorMessage", lastErrorMessage);

		return this;
	}

	public setTitle(title: string): UpdateTranslationPackagesParameters {
		this.set("title", title);

		return this;
	}

	public setCustomData(customData: any): UpdateTranslationPackagesParameters {
		this.set("customData", customData);

		return this;
	}

	public setPackageKey(packageKey: any): UpdateTranslationPackagesParameters {
		this.set("packageKey", packageKey);

		return this;
	}
}
