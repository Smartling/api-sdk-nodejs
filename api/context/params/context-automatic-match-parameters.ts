import BaseParameters from "../../parameters";

export class ContextAutomaticMatchParameters extends BaseParameters {
	setFileUri(fileUri: string): ContextAutomaticMatchParameters {
		this.set("contentFileUri", fileUri);

		return this;
	}

	setStringHashcodes(stringHashcodes: string[]): ContextAutomaticMatchParameters {
		this.set("stringHashcodes", stringHashcodes);

		return this;
	}

	setOverrideContextOlderThanDays(overrideContextOlderThanDays: number): ContextAutomaticMatchParameters {
		if (overrideContextOlderThanDays <= 1) {

		}
		this.set("overrideContextOlderThanDays", overrideContextOlderThanDays);

		return this;
	}
}
