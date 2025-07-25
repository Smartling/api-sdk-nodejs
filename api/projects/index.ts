import { SmartlingBaseApi } from "../base/index";
import { AccessTokenProvider } from "../auth/access-token-provider";
import { Logger } from "../logger";
import { ProjectDto } from "./dto/project-dto";
import { ListProjectsParameters } from "./params/list-projects-parameters";
import { SmartlingListResponse } from "../http/smartling-list-response";
import { ProjectWithoutTargetLocalesDto } from "./dto/project-without-target-locales-dto";

export class SmartlingProjectsApi extends SmartlingBaseApi {
    constructor(smartlingApiBaseUrl: string, authApi: AccessTokenProvider, logger: Logger) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/projects-api/v2/projects`;
    }

    async getProjectDetails(projectId: string): Promise<ProjectDto> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}`
        );
    }

    async listProjects(
        accountUid: string,
        parameters?: ListProjectsParameters
    ): Promise<SmartlingListResponse<ProjectWithoutTargetLocalesDto>> {
        const accountsEndpoint = this.entrypoint.replace("/projects-api/v2/projects", `/accounts-api/v2/accounts/${accountUid}/projects`);

        return await this.makeRequest(
            "get",
            accountsEndpoint,
            parameters ? parameters.export() : undefined
        );
    }
}
