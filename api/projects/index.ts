import { SmartlingBaseApi } from "../base";
import { SmartlingAuthApi } from "../auth";
import { Logger } from "../logger";

export class SmartlingProjectsApi extends SmartlingBaseApi {
    constructor(authApi: SmartlingAuthApi, logger: Logger, smartlingApiBaseUrl: string) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/projects-api/v2/projects`;
    }

    async getProjectDetails(projectId: string) {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}`
        );
    }
}
