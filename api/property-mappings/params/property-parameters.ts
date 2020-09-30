import BaseParameters from "../../parameters";

export class PropertyParameters extends BaseParameters {

	public setName(name: string): PropertyParameters {
		this.set("name", name);

		return this;
	};

	public setContentType(contentType: string): PropertyParameters {
		this.set("contentType", contentType);

		return this;
	};

	public setSpace(space: string): PropertyParameters {
		this.set("space", space);

		return this;
	};
}
