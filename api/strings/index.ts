import SmartlingAuthApi from "../auth";
import SmartlingBaseApi from "../base";
import {FetchSourceStringsParameters} from "./params/fetch-source-strings-parameters";
import {HTTPResponse} from "../http/response";
import {SourceStringDto} from "./dto/source-string-dto";
import {PropertyMappingDto} from "../property-mappings/dto/property-mapping-dto";

export class SmartlingSearchStringsApi extends SmartlingBaseApi {
	private readonly authApi: SmartlingAuthApi;
	private readonly entrypoint: string;

	constructor(authApi: SmartlingAuthApi, logger, smartlingApiBaseUrl: string) {
		super(logger);
		this.authApi = authApi;
		this.entrypoint = `${smartlingApiBaseUrl}/strings-search-api/v2/projects`;
	}

	buildQuery(hashCodes): string {
		const baseQuery = "(active:true AND deleted:false)";

		if (!Array.isArray(hashCodes)) {
			return `${baseQuery} AND hashcode:null`;
		}

		return `${baseQuery} AND (${hashCodes.map(value => `hashcode:${value}`).join(" OR ")})`;
	}

	async getStringsData(projectId: string, hashCodes?: string[]) {
		return await this.makeRequest(
			"post",
			`${this.entrypoint}/${projectId}/string-data`,
			JSON.stringify({
				query: this.buildQuery(hashCodes)
			})
		);
	}
}

export class SmartlingStringsApi extends SmartlingBaseApi {
	private readonly authApi: SmartlingAuthApi;
	private readonly entrypoint: string;

	constructor(authApi: SmartlingAuthApi, logger, smartlingApiBaseUrl: string) {
		super(logger);
		this.authApi = authApi;
		this.entrypoint = `${smartlingApiBaseUrl}/strings-api/v2/projects`;
	}

	async getSourceStrings(projectId: string, params: FetchSourceStringsParameters): Promise<HTTPResponse<SourceStringDto>> {
		return this.mapItemsToDtos(await this.makeRequest(
			"get",
			`${this.entrypoint}/${projectId}/source-strings`,
			params.export()
		));
	}

	private mapItemsToDtos(response: HTTPResponse<SourceStringDto>): HTTPResponse<SourceStringDto> {
		const retrievedItems = response.items || [];
		const items: SourceStringDto[] = retrievedItems;

		return {
			items,
			totalCount: response.totalCount
		};
	}
}
