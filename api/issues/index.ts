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
import { CreateIssueCommentParameters } from "./params/create-issue-comment-parameters";
import { EditIssueCommentParameters } from "./params/edit-issue-comment-parameters";
import { IssueDto } from "./dto/issue-dto";
import { IssueTextDto } from "./dto/issue-text-dto";
import { IssueStateDto } from "./dto/issue-state-dto";
import { IssueAnsweredDto } from "./dto/issue-answered-dto";
import { IssueAssigneeDto } from "./dto/issue-assignee-dto";
import { IssueSeverityLevelDto } from "./dto/issue-severity-level-dto";
import { IssueChangedTypeDto } from "./dto/issue-changed-type-dto";
import { IssueCommentDto } from "./dto/issue-comment-dto";
import { SmartlingListResponse } from "../http/smartling-list-response";
import { CountProjectIssuesParameters } from "./params/count-project-issues-parameters";
import { FindProjectIssuesParameters } from "./params/find-project-issues-parameters";
import { CountAccountIssuesParameters } from "./params/count-account-issues-parameters";
import { FindAccountIssuesParameters } from "./params/find-account-issues-parameters";
import { IssuesCountDto } from "./dto/issues-count-dto";

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

    async getIssueComments(
        projectId: string,
        issueUid: string
    ): Promise<SmartlingListResponse<IssueCommentDto>> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/projects/${projectId}/issues/${issueUid}/comments`
        );
    }

    async addIssueComment(
        projectId: string,
        issueUid: string,
        params: CreateIssueCommentParameters
    ): Promise<IssueCommentDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/projects/${projectId}/issues/${issueUid}/comments`,
            JSON.stringify(params.export())
        );
    }

    async updateIssueComment(
        projectId: string,
        issueUid: string,
        issueCommentUid: string,
        params: EditIssueCommentParameters
    ): Promise<IssueCommentDto> {
        return await this.makeRequest(
            "put",
            `${this.entrypoint}/projects/${projectId}/issues/${issueUid}/comments/${issueCommentUid}`,
            JSON.stringify(params.export())
        );
    }

    async getIssueCommentDetails(
        projectId: string,
        issueUid: string,
        issueCommentUid: string
    ): Promise<IssueCommentDto> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/projects/${projectId}/issues/${issueUid}/comments/${issueCommentUid}`
        );
    }

    async deleteIssueComment(
        projectId: string,
        issueUid: string,
        issueCommentUid: string
    ): Promise<void> {
        await this.makeRequest(
            "delete",
            `${this.entrypoint}/projects/${projectId}/issues/${issueUid}/comments/${issueCommentUid}`
        );
    }

    async findProjectIssues(
        projectId: string,
        params: FindProjectIssuesParameters
    ): Promise<SmartlingListResponse<IssueDto>> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/projects/${projectId}/issues/list`,
            JSON.stringify(params.export())
        );
    }

    async countProjectIssues(
        projectId: string,
        params: CountProjectIssuesParameters
    ): Promise<IssuesCountDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/projects/${projectId}/issues/count`,
            JSON.stringify(params.export())
        );
    }

    async findAccountIssues(
        accountUid: string,
        params: FindAccountIssuesParameters
    ): Promise<SmartlingListResponse<IssueDto>> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/accounts/${accountUid}/issues/list`,
            JSON.stringify(params.export())
        );
    }

    async countAccountIssues(
        accountUid: string,
        params: CountAccountIssuesParameters
    ): Promise<IssuesCountDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/accounts/${accountUid}/issues/count`,
            JSON.stringify(params.export())
        );
    }
}
