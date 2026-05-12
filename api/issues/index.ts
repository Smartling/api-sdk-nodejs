import { SmartlingBaseApi } from "../base/index";
import { AccessTokenProvider } from "../auth/access-token-provider";
import { Logger } from "../logger";
import { CreateIssueParameters } from "./params/create-issue-parameters";
import { IssueDto } from "./dto/issue-dto";

export class SmartlingIssuesApi extends SmartlingBaseApi {
    constructor(smartlingApiBaseUrl: string, authApi: AccessTokenProvider, logger: Logger) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/issues-api/v2`;
    }

    async createIssue(
        projectId: string,
        params: CreateIssueParameters
    ): Promise<IssueDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/projects/${projectId}/issues`,
            JSON.stringify(params.export())
        );
    }
}
