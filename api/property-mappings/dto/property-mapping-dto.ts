export interface PropertyMappingDto<T, S> {
	propertyMappingUid?: string;
	property: T;
	mapping: S;
	created: Date;
	modified: Date;
}
