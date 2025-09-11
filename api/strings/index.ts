import { SmartlingBaseApi } from "../base/index";
import { AccessTokenProvider } from "../auth/access-token-provider";
import { FetchSourceStringsParameters } from "./params/fetch-source-strings-parameters";
import { CreateStringsParameters } from "./params/create-strings-parameters";
import { SmartlingListResponse } from "../http/smartling-list-response";
import { SourceStringDto } from "./dto/source-string-dto";
import { CreateStringsResponseDto } from "./dto/create-strings-response-dto";
import { ProcessStatusDto } from "./dto/process-status-dto";
import { Logger } from "../logger";

export class SmartlingStringsApi extends SmartlingBaseApi {
    constructor(smartlingApiBaseUrl: string, authApi: AccessTokenProvider, logger: Logger) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/strings-api/v2/projects`;
    }

    async getSourceStrings(
        projectId: string, params: FetchSourceStringsParameters
    ): Promise<SmartlingListResponse<SourceStringDto>> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/source-strings`,
            params.export()
        );
    }

    async createStrings(
        projectUid: string,
        params: CreateStringsParameters
    ): Promise<CreateStringsResponseDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectUid}`,
            JSON.stringify(params.export())
        );
    }

    async getCreateStringStatus(
        projectUid: string,
        processUid: string
    ): Promise<SmartlingListResponse<ProcessStatusDto>> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectUid}/processes/${processUid}`
        );
    }
}
