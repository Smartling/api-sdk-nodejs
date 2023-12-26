import { SmartlingBaseApi } from "../base";
import { SmartlingAuthApi } from "../auth";
import { Logger } from "../logger";
import { SmartlingListResponse } from "../http/smartling-list-response";
import { GetRecentlyPublishedFilesParameters } from "./params/get-recently-published-files-parameters";
import { RecentlyPublishedFileDto } from "./dto/recently-published-file-dto";

export class SmartlingPublishedFilesApi extends SmartlingBaseApi {
    constructor(smartlingApiBaseUrl: string, authApi: SmartlingAuthApi, logger: Logger) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/published-files-api/v2/projects`;
    }

    async getRecentlyPublishedFiles(
        projectId: string, params: GetRecentlyPublishedFilesParameters
    ): Promise<SmartlingListResponse<RecentlyPublishedFileDto>> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/files/list/recently-published`,
            Object.assign(params.export(), {})
        );
    }
}
