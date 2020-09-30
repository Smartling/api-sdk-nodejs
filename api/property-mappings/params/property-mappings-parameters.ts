import BaseParameters from "../../parameters";
import {MappingParameters} from "./mapping-parameters";
import {PropertyParameters} from "./property-parameters";

export class PropertyMappingsParameters extends BaseParameters {
	public setMapping(mappingParameters: MappingParameters): PropertyMappingsParameters {
		this.set("mapping", mappingParameters.export());

		return this;
	};

	public setProperty(propertyParameters: PropertyParameters): PropertyMappingsParameters {
		this.set("property", propertyParameters.export());

		return this;
	};
}
