import SmartlingBaseApi from "../base";
import SmartlingAuthApi from "../auth";
import {CreateTranslationPackagesParameters} from "./params/create-translation-packages-parameters";
import {TranslationPackageDto} from "./dto/translation-package-dto";
import {HTTPResponse} from "../http/response";
import {UpdateTranslationPackagesParameters} from "./params/update-translation-packages-parameters";
import {SearchTranslationPackagesParameters} from "./params/search-translation-packages-parameters";

export class SmartlingTranslationPackagesApi extends SmartlingBaseApi {
	private readonly authApi: SmartlingAuthApi;
	private readonly entrypoint: string;

	constructor(authApi, logger, smartlingApiBaseUrl) {
		super(logger);
		this.authApi = authApi;
		this.entrypoint = `${smartlingApiBaseUrl}/submission-service-api/v2/projects`;
	}

	async createTranslationPackage<TCustomData, TPackageKey>(
		projectId: string,
		bucketName: string,
		params: CreateTranslationPackagesParameters): Promise<TranslationPackageDto<TCustomData, TPackageKey>> {
		return this.mapItemToDto(
			await this.makeRequest(
				"post",
				`${this.entrypoint}/${projectId}/buckets/${bucketName}/translation-packages`,
				JSON.stringify(params.export())
			)
		);
	}

	async getTranslationPackage<TCustomData, TPackageKey>(
		projectId: string,
		bucketName: string,
		translationPackageUid: string): Promise<TranslationPackageDto<TCustomData, TPackageKey>> {
		return this.mapItemToDto(
			await this.makeRequest(
				"get",
				`${this.entrypoint}/${projectId}/buckets/${bucketName}/translation-packages/${translationPackageUid}`
			)
		);
	}

	async updateTranslationPackage<TCustomData, TPackageKey>(
		projectId: string,
		bucketName: string,
		translationPackageUid: string,
		params: UpdateTranslationPackagesParameters): Promise<TranslationPackageDto<TCustomData, TPackageKey>> {
		return this.mapItemToDto(
			await this.makeRequest(
				"put",
				`${this.entrypoint}/${projectId}/buckets/${bucketName}/translation-packages/${translationPackageUid}`,
				JSON.stringify(params.export())
			)
		);
	}

	async searchTranslationPackages<TCustomData, TPackageKey>(
		projectId: string,
		bucketName: string,
		params: SearchTranslationPackagesParameters): Promise<HTTPResponse<TranslationPackageDto<TCustomData, TPackageKey>>> {
		return this.mapItemsToDtos<TCustomData, TPackageKey>(
			await this.makeRequest(
				"get",
				`${this.entrypoint}/${projectId}/buckets/${bucketName}/translation-packages`,
				params.export()
			)
		);
	}

	private mapItemToDto<TCustomData, TPackageKey>(translationPackage: TranslationPackageDto<TCustomData, TPackageKey>): TranslationPackageDto<TCustomData, TPackageKey> {
		["createdDate", "modifiedDate"].forEach(function (field) {
			if (translationPackage[field]) {
				translationPackage[field] = new Date(translationPackage[field]);
			}
		});

		return translationPackage as TranslationPackageDto<TCustomData, TPackageKey>;
	}

	private mapItemsToDtos<TCustomData, TPackageKey>(response: HTTPResponse<TranslationPackageDto<TCustomData, TPackageKey>>): HTTPResponse<TranslationPackageDto<TCustomData, TPackageKey>> {
		const retrievedItems = response.items || [];
		const items: Array<TranslationPackageDto<TCustomData, TPackageKey>> = retrievedItems.map(item => {
			return this.mapItemToDto(item);
		});

		return {
			items,
			totalCount: response.totalCount
		};
	}
}
