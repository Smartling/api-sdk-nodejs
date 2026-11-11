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
import { AccountProjectTypeDto } from "./dto/account-project-type-dto";
import { GetAccountProjectTypesParameters } from "./params/get-account-project-types-parameters";

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
            `${this.entrypoint}/${encodeURIComponent(projectId)}`,
            includeDisabledLocales === undefined ? undefined : { includeDisabledLocales }
        );
    }

    async listProjects(
        accountUid: string,
        parameters?: ListProjectsParameters
    ): Promise<SmartlingListResponse<ProjectWithoutTargetLocalesDto>> {
        const accountsEndpoint = this.getAccountsEndpoint(accountUid, "projects");

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
            this.getAccountsEndpoint(accountUid, "projects"),
            JSON.stringify(params.export())
        );
    }

    async getAccountProjectTypes(
        accountUid: string,
        params?: GetAccountProjectTypesParameters
    ): Promise<SmartlingListResponse<AccountProjectTypeDto>> {
        return await this.makeRequest(
            "get",
            this.getAccountsEndpoint(accountUid, "project-types"),
            params ? params.export() : undefined
        );
    }

    async archiveProject(projectId: string): Promise<ProjectDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${encodeURIComponent(projectId)}/archive`
        );
    }

    async unarchiveProject(projectId: string): Promise<ProjectDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${encodeURIComponent(projectId)}/unarchive`
        );
    }

    async renameProject(projectId: string, params: RenameProjectParameters): Promise<ProjectDto> {
        return await this.makeRequest(
            "put",
            `${this.entrypoint}/${encodeURIComponent(projectId)}/rename`,
            JSON.stringify(params.export())
        );
    }

    // Returns only { description }, not the full ProjectDto every other mutation here returns -
    // confirmed against the real API via the integration test: the endpoint's response genuinely
    // is description-only, not a trimmed-down echo of the project.
    async updateProjectDescription(
        projectId: string,
        params: UpdateProjectDescriptionParameters
    ): Promise<ProjectDescriptionDto> {
        return await this.makeRequest(
            "put",
            `${this.entrypoint}/${encodeURIComponent(projectId)}/description`,
            JSON.stringify(params.export())
        );
    }

    async createTargetLocale(
        projectId: string,
        params: CreateTargetLocaleParameters
    ): Promise<ProjectDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${encodeURIComponent(projectId)}/targetLocales`,
            JSON.stringify(params.export())
        );
    }

    // Hits /locales/{localeId}, not /targetLocales like createTargetLocale/getTargetLocales -
    // this is deliberate, not a typo: it disables the locale rather than removing it (confirmed
    // by the integration test), a distinct operation from the /targetLocales resource.
    async deleteTargetLocale(projectId: string, localeId: string): Promise<void> {
        await this.makeRequest(
            "delete",
            `${this.entrypoint}/${encodeURIComponent(projectId)}/locales/${encodeURIComponent(localeId)}`
        );
    }

    async getTargetLocales(projectId: string): Promise<SmartlingListResponse<LocaleDto>> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${encodeURIComponent(projectId)}/targetLocales`
        );
    }

    private getAccountsEndpoint(accountUid: string, resource: string): string {
        return this.entrypoint.replace(
            "/projects-api/v2/projects",
            `/accounts-api/v2/accounts/${encodeURIComponent(accountUid)}/${resource}`
        );
    }
}
