export interface TranslationPackageDto<TCustomData, TPackageKey> {
	translationPackageUid: string;
	customData: TCustomData;
	packageKey: TPackageKey;
	createdDate: Date;
	modifiedDate: Date;
	title: string;
	state: string;
	percentComplete: number;
	projectId: string;
	bucketName: string;
	lastErrorMessage: string;
	version: number;
}
