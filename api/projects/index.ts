import { SmartlingBaseApi } from "../base/index";
import { SmartlingAuthApi } from "../auth/index";
import { Logger } from "../logger";
import { ProjectDto } from "./dto/project-dto";
import { IsNotEmpty, Validate } from "../decorators";

export class SmartlingProjectsApi extends SmartlingBaseApi {
    constructor(smartlingApiBaseUrl: string, authApi: SmartlingAuthApi, logger: Logger) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/projects-api/v2/projects`;
    }

    @Validate
    async getProjectDetails(@IsNotEmpty projectId: string): Promise<ProjectDto> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}`
        );
    }
}
