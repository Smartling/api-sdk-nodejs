import { SmartlingBaseApi } from "../base/index";
import { AccessTokenProvider } from "../auth/access-token-provider";
import { Logger } from "../logger";
import { CreateIssueParameters } from "./params/create-issue-parameters";
import { EditIssueParameters } from "./params/edit-issue-parameters";
import { UpdateIssueStateParameters } from "./params/update-issue-state-parameters";
import { IssueDto } from "./dto/issue-dto";
import { IssueTextDto } from "./dto/issue-text-dto";
import { IssueStateDto } from "./dto/issue-state-dto";

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

    async editIssue(
        projectId: string,
        issueUid: string,
        params: EditIssueParameters
    ): Promise<IssueTextDto> {
        return await this.makeRequest(
            "put",
            `${this.entrypoint}/projects/${projectId}/issues/${issueUid}/issueText`,
            JSON.stringify(params.export())
        );
    }

    async openOrCloseIssue(
        projectId: string,
        issueUid: string,
        params: UpdateIssueStateParameters
    ): Promise<IssueStateDto> {
        return await this.makeRequest(
            "put",
            `${this.entrypoint}/projects/${projectId}/issues/${issueUid}/state`,
            JSON.stringify(params.export())
        );
    }

    async getIssueDetails(
        projectId: string,
        issueUid: string
    ): Promise<IssueDto> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/projects/${projectId}/issues/${issueUid}`
        );
    }
}
