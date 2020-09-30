import SmartlingAuthApi from "../auth";
import SmartlingBaseApi from "../base";
import {PropertyMappingDto} from "./dto/property-mapping-dto";
import {PropertyDto} from "./dto/property-dto";
import {MappingDto} from "./dto/mapping-dto";
import {Response} from "../published-files/response";
import {PropertyMappingsParameters} from "./params/property-mappings-parameters";
import {PropertyParameters} from "./params/property-parameters";

export class SmartlingPropertyMappingsApi extends SmartlingBaseApi {
	private readonly authApi: SmartlingAuthApi;
	private readonly entrypoint: string;

	constructor(authApi: SmartlingAuthApi, logger: any, smartlingApiBaseUrl: string) {
		super(logger);

		this.authApi = authApi;
		this.entrypoint = `${smartlingApiBaseUrl}/connectors-property-mappings-api/v2`;
	}

	public async createProjectPropertyMapping(
		projectId: string,
		integrationId: string,
		params: PropertyMappingsParameters
	): Promise<PropertyMappingDto<PropertyDto, MappingDto>> {
		return this.mapItemToDto<PropertyDto, MappingDto>(await this.makeRequest(
			"post",
			this.getProjectPropertyMappingsApiUrl(projectId, integrationId),
			JSON.stringify(params.export())
		));
	}

	public async createAccountPropertyMapping(
		accountUid: string,
		integrationId: string,
		params: PropertyMappingsParameters
	): Promise<PropertyMappingDto<PropertyDto, MappingDto>> {
		return this.mapItemToDto<PropertyDto, MappingDto>(await this.makeRequest(
			"post",
			this.getAccountPropertyMappingsApiUrl(accountUid, integrationId),
			JSON.stringify(params.export())
		));
	}

	public async updateProjectPropertyMapping(
		projectId: string,
		integrationId: string,
		propertyMappingUid: string,
		params: PropertyMappingsParameters
	): Promise<PropertyMappingDto<PropertyDto, MappingDto>> {
		return this.mapItemToDto<PropertyDto, MappingDto>(await this.makeRequest(
			"put",
			`${this.getProjectPropertyMappingsApiUrl(projectId, integrationId)}/${propertyMappingUid}`,
			JSON.stringify(params.export())
		));
	}

	public async updateAccountPropertyMapping(
		accountUid: string,
		integrationId: string,
		propertyMappingUid: string,
		params: PropertyMappingsParameters
	): Promise<PropertyMappingDto<PropertyDto, MappingDto>> {
		return this.mapItemToDto<PropertyDto, MappingDto>(await this.makeRequest(
			"put",
			`${this.getAccountPropertyMappingsApiUrl(accountUid, integrationId)}/${propertyMappingUid}`,
			JSON.stringify(params.export())
		));
	}

	public async getAccountPropertyMappings(
		accountUid: string,
		integrationId: string
	): Promise<Response<PropertyMappingDto<PropertyDto, MappingDto>>> {
		return this.mapItemsToDtos<PropertyDto, MappingDto>(await this.makeRequest(
			"get",
			this.getAccountPropertyMappingsApiUrl(accountUid, integrationId)
		));
	}

	public async getProjectPropertyMappings(
		projectId: string,
		integrationId: string
	): Promise<Response<PropertyMappingDto<PropertyDto, MappingDto>>> {
		return this.mapItemsToDtos<PropertyDto, MappingDto>(await this.makeRequest(
			"get",
			this.getProjectPropertyMappingsApiUrl(projectId, integrationId),
		));
	}

	public async searchAccountPropertyMappings(
		accountUid: string,
		integrationId: string,
		params: PropertyParameters
	): Promise<Response<PropertyMappingDto<PropertyDto, MappingDto>>> {
		return this.mapItemsToDtos<PropertyDto, MappingDto>(await this.makeRequest(
			"get",
			`${this.getAccountPropertyMappingsApiUrl(accountUid, integrationId)}?property=${JSON.stringify(params.export())}`
		));
	}

	public async searchProjectPropertyMappings(
		projectId: string,
		integrationId: string,
		params: PropertyParameters
	): Promise<Response<PropertyMappingDto<PropertyDto, MappingDto>>> {
		return this.mapItemsToDtos<PropertyDto, MappingDto>(await this.makeRequest(
			"get",
			`${this.getProjectPropertyMappingsApiUrl(projectId, integrationId)}?property=${JSON.stringify(params.export())}`
		));
	}

	private getProjectPropertyMappingsApiUrl(projectId: string, integrationId: string): string {
		return `${this.entrypoint}/projects/${projectId}/integrations/${integrationId}/property-mappings`;
	}

	private getAccountPropertyMappingsApiUrl(accountUid: string, integrationId: string): string {
		return `${this.entrypoint}/accounts/${accountUid}/integrations/${integrationId}/property-mappings`;
	}

	private mapItemToDto<T, S>(propertyMapping: object): PropertyMappingDto<T, S> {
		["created", "modified"].forEach(function (field) {
			if (propertyMapping[field]) {
				propertyMapping[field] = new Date(propertyMapping[field]);
			}
		});

		return propertyMapping as PropertyMappingDto<T, S>;
	}

	private mapItemsToDtos<T, S>(response: Response<object>): Response<PropertyMappingDto<T, S>> {
		const retrievedItems = response.items || [];
		const items: Array<PropertyMappingDto<T, S>> = retrievedItems.map(item => {
			return this.mapItemToDto(item) as PropertyMappingDto<T, S>;
		});

		return {
			items,
		};
	}
}
