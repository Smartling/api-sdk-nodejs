import { SmartlingBaseApi } from "../base/index";
import { AccessTokenProvider } from "../auth/access-token-provider";
import { Logger } from "../logger";
import { CreateIssueParameters } from "./params/create-issue-parameters";
import { EditIssueParameters } from "./params/edit-issue-parameters";
import { UpdateIssueStateParameters } from "./params/update-issue-state-parameters";
import { UpdateIssueAnsweredParameters } from "./params/update-issue-answered-parameters";
import { UpdateIssueAssigneeParameters } from "./params/update-issue-assignee-parameters";
import { UpdateIssueSeverityLevelParameters } from "./params/update-issue-severity-level-parameters";
import { UpdateIssueTypeParameters } from "./params/update-issue-type-parameters";
import { IssueDto } from "./dto/issue-dto";
import { IssueTextDto } from "./dto/issue-text-dto";
import { IssueStateDto } from "./dto/issue-state-dto";
import { IssueAnsweredDto } from "./dto/issue-answered-dto";
import { IssueAssigneeDto } from "./dto/issue-assignee-dto";
import { IssueSeverityLevelDto } from "./dto/issue-severity-level-dto";
import { IssueChangedTypeDto } from "./dto/issue-changed-type-dto";

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

    async updateIssueAnswered(
        projectId: string,
        issueUid: string,
        params: UpdateIssueAnsweredParameters
    ): Promise<IssueAnsweredDto> {
        return await this.makeRequest(
            "put",
            `${this.entrypoint}/projects/${projectId}/issues/${issueUid}/answered`,
            JSON.stringify(params.export())
        );
    }

    async updateIssueAssignee(
        projectId: string,
        issueUid: string,
        params: UpdateIssueAssigneeParameters
    ): Promise<IssueAssigneeDto> {
        return await this.makeRequest(
            "put",
            `${this.entrypoint}/projects/${projectId}/issues/${issueUid}/assignee`,
            JSON.stringify(params.export())
        );
    }

    async deleteIssueAssignee(
        projectId: string,
        issueUid: string
    ): Promise<void> {
        await this.makeRequest(
            "delete",
            `${this.entrypoint}/projects/${projectId}/issues/${issueUid}/assignee`
        );
    }

    async updateIssueSeverityLevel(
        projectId: string,
        issueUid: string,
        params: UpdateIssueSeverityLevelParameters
    ): Promise<IssueSeverityLevelDto> {
        return await this.makeRequest(
            "put",
            `${this.entrypoint}/projects/${projectId}/issues/${issueUid}/severity-level`,
            JSON.stringify(params.export())
        );
    }

    async updateIssueType(
        projectId: string,
        issueUid: string,
        params: UpdateIssueTypeParameters
    ): Promise<IssueChangedTypeDto> {
        return await this.makeRequest(
            "put",
            `${this.entrypoint}/projects/${projectId}/issues/${issueUid}/change-type`,
            JSON.stringify(params.export())
        );
    }
}
