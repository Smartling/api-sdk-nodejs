import BaseParameters from "../../parameters";
import FormData from "form-data"

export class ContextUploadParameters extends BaseParameters {
	setName(name: string): ContextUploadParameters {
		this.set("name", name);

		return this;
	}

	setContent(content: any): ContextUploadParameters {
		this.set("content", content);

		return this;
	}
}
