import { SmartlingBaseApi } from "../base";
import { SmartlingAuthApi } from "../auth";

export class SmartlingJobsApi extends SmartlingBaseApi {
    constructor(authApi: SmartlingAuthApi, logger, smartlingApiBaseUrl: string) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/jobs-api/v3/projects`;
    }

    async createJob(projectId, params) {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/jobs`,
            JSON.stringify(params.export())
        );
    }

    async getJob(projectId, translationJobUid) {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/jobs/${translationJobUid}`
        );
    }

    async getJobFiles(projectId, translationJobUid, params) {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/jobs/${translationJobUid}/files`,
            params.export()
        );
    }

    async listJobs(projectId, params) {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/jobs`,
            params.export()
        );
    }

    async searchJobs(projectId, params) {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/jobs/search`,
            params.export()
        );
    }

    async removeFileFromJob(projectId, translationJobUid, params) {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/jobs/${translationJobUid}/file/remove`,
            JSON.stringify(params.export())
        );
    }

    async getJobFileProgress(projectId, translationJobUid, params) {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/jobs/${translationJobUid}/file/progress`,
            params.export()
        );
    }
}
