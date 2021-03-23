import BaseParameters from "../../parameters";

export class FetchSourceStringsParameters extends BaseParameters {
	setHashCodes(hashCodes: string[]): FetchSourceStringsParameters {
		this.set("hashcodes", hashCodes);

		return this;
	}

	setFileUri(fileUri: string): FetchSourceStringsParameters {
		this.set("fileUri", fileUri);

		return this;
	}

	setLimit(limit: number): FetchSourceStringsParameters {
		this.set("limit", limit);

		return this;
	}

	setOffset(offset: number): FetchSourceStringsParameters {
		this.set("offset", offset);

		return this;
	}
}
