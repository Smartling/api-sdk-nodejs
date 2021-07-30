import SmartlingAuthApi from "../auth";
import SmartlingBaseApi from "../base";
import {FetchSourceStringsParameters} from "./params/fetch-source-strings-parameters";
import {HTTPResponse} from "../http/response";
import {SourceStringDto} from "./dto/source-string-dto";

export default class SmartlingStringsApi extends SmartlingBaseApi {
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
