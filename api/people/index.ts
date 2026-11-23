import { SmartlingBaseApi } from "../base/index";
import { AccessTokenProvider } from "../auth/access-token-provider";
import { Logger } from "../logger";
import { TeamViewFilterParameters } from "./params/team-view-filter-parameters";
import { TeamViewItemDto } from "./dto/team-view-item-dto";
import { OffsetPageResponse } from "./dto/offset-page-response";

export class SmartlingPeopleApi extends SmartlingBaseApi {
    constructor(smartlingApiBaseUrl: string, authApi: AccessTokenProvider, logger: Logger) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/people-api/v3`;
    }

    async searchAccountUsers(
        accountUid: string,
        params?: TeamViewFilterParameters
    ): Promise<OffsetPageResponse<TeamViewItemDto>> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/accounts/${encodeURIComponent(accountUid)}/users`,
            JSON.stringify(params?.export() || {})
        );
    }
}
