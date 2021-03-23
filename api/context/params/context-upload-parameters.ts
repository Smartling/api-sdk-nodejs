import BaseParameters from "../../parameters";

export class ContextUploadParameters extends BaseParameters {
	setName(name: string): ContextUploadParameters {
		this.set("name", name);

		return this;
	}

	setContent(file: File): ContextUploadParameters {
		this.set("content", file);

		return this;
	}
}
