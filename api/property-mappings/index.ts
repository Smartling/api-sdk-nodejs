import SmartlingAuthApi from "../auth";
import SmartlingBaseApi from "../base";
import {Response} from "../published-files/response";
import BaseParameters from "../parameters";

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
		params: BaseParameters
	): Promise<any> {
		return this.mapItemToDto(await this.makeRequest(
			"post",
			this.getProjectPropertyMappingsApiUrl(projectId, integrationId),
			JSON.stringify(params.export())
		));
	}

	public async createAccountPropertyMapping(
		accountUid: string,
		integrationId: string,
		params: BaseParameters
	): Promise<any> {
		return this.mapItemToDto(await this.makeRequest(
			"post",
			this.getAccountPropertyMappingsApiUrl(accountUid, integrationId),
			JSON.stringify(params.export())
		));
	}

	public async updateProjectPropertyMapping(
		projectId: string,
		integrationId: string,
		propertyMappingUid: string,
		params: BaseParameters
	): Promise<any> {
		return this.mapItemToDto(await this.makeRequest(
			"put",
			`${this.getProjectPropertyMappingsApiUrl(projectId, integrationId)}/${propertyMappingUid}`,
			JSON.stringify(params.export())
		));
	}

	public async updateAccountPropertyMapping(
		accountUid: string,
		integrationId: string,
		propertyMappingUid: string,
		params: BaseParameters
	): Promise<any> {
		return this.mapItemToDto(await this.makeRequest(
			"put",
			`${this.getAccountPropertyMappingsApiUrl(accountUid, integrationId)}/${propertyMappingUid}`,
			JSON.stringify(params.export())
		));
	}

	public async getAccountPropertyMappings(
		accountUid: string,
		integrationId: string
	): Promise<Response<any>> {
		return this.mapItemsToDtos(await this.makeRequest(
			"get",
			this.getAccountPropertyMappingsApiUrl(accountUid, integrationId)
		));
	}

	public async getProjectPropertyMappings(
		projectId: string,
		integrationId: string
	): Promise<Response<any>> {
		return this.mapItemsToDtos(await this.makeRequest(
			"get",
			this.getProjectPropertyMappingsApiUrl(projectId, integrationId),
		));
	}

	public async searchAccountPropertyMappings(
		accountUid: string,
		integrationId: string,
		params: BaseParameters
	): Promise<Response<any>> {
		return this.mapItemsToDtos(await this.makeRequest(
			"get",
			`${this.getAccountPropertyMappingsApiUrl(accountUid, integrationId)}?property=${JSON.stringify(params.export())}`
		));
	}

	public async searchProjectPropertyMappings(
		projectId: string,
		integrationId: string,
		params: BaseParameters
	): Promise<Response<any>> {
		return this.mapItemsToDtos(await this.makeRequest(
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

	private mapItemToDto(propertyMapping: object): any {
		["created", "modified"].forEach(function (field) {
			if (propertyMapping[field]) {
				propertyMapping[field] = new Date(propertyMapping[field]);
			}
		});

		return propertyMapping;
	}

	private mapItemsToDtos(response: Response<object>): Response<any> {
		const retrievedItems = response.items || [];
		const items: Array<any> = retrievedItems.map(item => {
			return this.mapItemToDto(item);
		});

		return {
			items,
		};
	}
}
