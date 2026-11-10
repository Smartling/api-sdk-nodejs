import { SmartlingBaseApi } from "../base/index";
import { AccessTokenProvider } from "../auth/access-token-provider";
import { Logger } from "../logger";
import { ProjectDto } from "./dto/project-dto";
import { ListProjectsParameters } from "./params/list-projects-parameters";
import { SmartlingListResponse } from "../http/smartling-list-response";
import { ProjectWithoutTargetLocalesDto } from "./dto/project-without-target-locales-dto";
import { ProjectCreateResponseDto } from "./dto/project-create-response-dto";
import { ProjectDescriptionDto } from "./dto/project-description-dto";
import { LocaleDto } from "./dto/locale-dto";
import { CreateProjectParameters } from "./params/create-project-parameters";
import { RenameProjectParameters } from "./params/rename-project-parameters";
import { UpdateProjectDescriptionParameters } from "./params/update-project-description-parameters";
import { CreateTargetLocaleParameters } from "./params/create-target-locale-parameters";

export class SmartlingProjectsApi extends SmartlingBaseApi {
    constructor(smartlingApiBaseUrl: string, authApi: AccessTokenProvider, logger: Logger) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/projects-api/v2/projects`;
    }

    async getProjectDetails(
        projectId: string,
        includeDisabledLocales?: boolean
    ): Promise<ProjectDto> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}`,
            includeDisabledLocales === undefined ? undefined : { includeDisabledLocales }
        );
    }

    async listProjects(
        accountUid: string,
        parameters?: ListProjectsParameters
    ): Promise<SmartlingListResponse<ProjectWithoutTargetLocalesDto>> {
        const accountsEndpoint = this.getAccountsEndpoint(accountUid);

        return await this.makeRequest(
            "get",
            accountsEndpoint,
            parameters ? parameters.export() : undefined
        );
    }

    async createProject(
        accountUid: string,
        params: CreateProjectParameters
    ): Promise<ProjectCreateResponseDto> {
        return await this.makeRequest(
            "post",
            this.getAccountsEndpoint(accountUid),
            JSON.stringify(params.export())
        );
    }

    async archiveProject(projectId: string): Promise<ProjectDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/archive`
        );
    }

    async unarchiveProject(projectId: string): Promise<ProjectDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/unarchive`
        );
    }

    async renameProject(projectId: string, params: RenameProjectParameters): Promise<ProjectDto> {
        return await this.makeRequest(
            "put",
            `${this.entrypoint}/${projectId}/rename`,
            JSON.stringify(params.export())
        );
    }

    async updateProjectDescription(
        projectId: string,
        params: UpdateProjectDescriptionParameters
    ): Promise<ProjectDescriptionDto> {
        return await this.makeRequest(
            "put",
            `${this.entrypoint}/${projectId}/description`,
            JSON.stringify(params.export())
        );
    }

    async createTargetLocale(
        projectId: string,
        params: CreateTargetLocaleParameters
    ): Promise<ProjectDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/targetLocales`,
            JSON.stringify(params.export())
        );
    }

    async deleteTargetLocale(projectId: string, localeId: string): Promise<void> {
        await this.makeRequest(
            "delete",
            `${this.entrypoint}/${projectId}/locales/${localeId}`
        );
    }

    async getTargetLocales(projectId: string): Promise<SmartlingListResponse<LocaleDto>> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/targetLocales`
        );
    }

    private getAccountsEndpoint(accountUid: string): string {
        return this.entrypoint.replace("/projects-api/v2/projects", `/accounts-api/v2/accounts/${accountUid}/projects`);
    }
}
