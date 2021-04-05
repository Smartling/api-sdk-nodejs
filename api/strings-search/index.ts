import SmartlingAuthApi from "../auth";
import SmartlingBaseApi from "../base";

export default class SmartlingSearchStringsApi extends SmartlingBaseApi {
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
