import { SmartlingBaseApi } from "../base/index";
import { AuthApi } from "../auth/auth-api";
import { Logger } from "../logger";
import { RecentlyPublishedFilesParameters } from "./params/recently-published-files-parameters";
import { PublishedFileDto } from "./dto/published-file-dto";
import { SmartlingListResponse } from "../http/smartling-list-response";

export class SmartlingPublishedFilesApi extends SmartlingBaseApi {
    constructor(smartlingApiBaseUrl: string, authApi: AuthApi, logger: Logger) {
        super(logger);

        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/published-files-api/v2`;
    }

    public async getRecentlyPublishedFiles(
        projectUid: string, params: RecentlyPublishedFilesParameters
    ): Promise<SmartlingListResponse<PublishedFileDto>> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/projects/${projectUid}/files/list/recently-published`,
            params.export()
        );
    }
}
