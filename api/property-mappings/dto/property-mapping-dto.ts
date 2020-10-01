export interface PropertyMappingDto<TProperty, TMapping> {
	propertyMappingUid: string;
	property: TProperty;
	mapping: TMapping;
	created?: Date;
	modified?: Date;
}
