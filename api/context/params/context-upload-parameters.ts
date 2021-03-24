import BaseParameters from "../../parameters";

export class ContextUploadParameters extends BaseParameters {
	setName(name: string): ContextUploadParameters {
		this.set("name", name);

		return this;
	}

	setContent(content: any): ContextUploadParameters {
		this.set("content", content);

		return this;
	}

	export() {
		const form = new FormData();
		if (this.parameters.file)
			form.append("content", this.parameters.file);
		if (this.parameters.name)
			form.append("name", this.parameters.name);
		return this.parameters;
	}
}
