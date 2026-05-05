import { SmartlingBaseApi } from "../base/index";
import { AccessTokenProvider } from "../auth/access-token-provider";
import { Logger } from "../logger";
import { ContentAssignmentDto } from "./dto/content-assignment-dto";
import { SmartlingBareListResponse } from "../http/smartling-bare-list-response";

export class SmartlingVendorsApi extends SmartlingBaseApi {
    constructor(smartlingApiBaseUrl: string, authApi: AccessTokenProvider, logger: Logger) {
        super(logger);

        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/vendors-api/v2`;
    }

    public async getContentAssignmentsByAccount(
        accountUid: string
    ): Promise<SmartlingBareListResponse<ContentAssignmentDto>> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/accounts/${accountUid}/content-assignments`
        );
    }
}
