import { SmartlingBaseApi } from "../base";
import { SmartlingAuthApi } from "../auth";

export class SmartlingProjectsApi extends SmartlingBaseApi {
    constructor(authApi: SmartlingAuthApi, logger, smartlingApiBaseUrl: string) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/projects-api/v2/projects`;
    }

    async getProjectDetails(projectId) {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}`
        );
    }
}
