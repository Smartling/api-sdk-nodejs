import BaseParameters from "../../parameters";

export class PropertyMappingParameters extends BaseParameters {
	constructor(property?: string) {
		super({property});
	}

	public setProperty(property: object): PropertyMappingParameters {
		this.set("property", property);

		return this;
	};

	public setMapping(mapping: object): PropertyMappingParameters {
		this.set("mapping", mapping);

		return this;
	};
}
