import { SmartlingBaseApi } from "../base/index";
import { SmartlingAuthApi } from "../auth/index";
import { FetchSourceStringsParameters } from "./params/fetch-source-strings-parameters";
import { HTTPResponse } from "../http/response";
import { SourceStringDto } from "./dto/source-string-dto";
import { Logger } from "../logger";

export class SmartlingStringsApi extends SmartlingBaseApi {
    constructor(authApi: SmartlingAuthApi, logger: Logger, smartlingApiBaseUrl: string) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/strings-api/v2/projects`;
    }

    async getSourceStrings(
        projectId: string, params: FetchSourceStringsParameters
    ): Promise<HTTPResponse<SourceStringDto>> {
        return SmartlingStringsApi.mapItemsToDtos(await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/source-strings`,
            params.export()
        ));
    }

    private static mapItemsToDtos(
        response: HTTPResponse<SourceStringDto>
    ): HTTPResponse<SourceStringDto> {
        const retrievedItems = response.items || [];
        const items: SourceStringDto[] = retrievedItems;

        return {
            items,
            totalCount: response.totalCount
        };
    }
}
