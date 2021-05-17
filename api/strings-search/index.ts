import SmartlingAuthApi from "../auth";
import SmartlingBaseApi from "../base";
import { HTTPResponse } from "../http/response";
import { StringDataDto } from "./dto/string-data-dto";

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
        return this.mapItemsToDtos(
            await this.makeRequest(
                "post",
                `${this.entrypoint}/${projectId}/string-data`,
                JSON.stringify({
                    query: this.buildQuery(hashCodes)
                })
            )
        );
    }

    private mapItemsToDtos(response: HTTPResponse<StringDataDto>): HTTPResponse<StringDataDto> {
        return {
            items: (response.items || []) as Array<StringDataDto>,
            totalCount: response.totalCount
        };
    }
}
