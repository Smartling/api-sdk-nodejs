const SmartlingBaseApi = require("../base");

class SmartlingJobApi extends SmartlingBaseApi {
    constructor(authApi, logger, smartlingApiBaseUrl) {
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

    async removeFileFromJob(projectId, translationJobUid, params) {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/jobs/${translationJobUid}/file/remove`,
            JSON.stringify(params.export())
        );
    }
}

module.exports = SmartlingJobApi;
