const SmartlingBaseApi = require("../base");

class SmartlingJobApi extends SmartlingBaseApi {
    constructor(authApi, logger, smartlingApiBaseUrl) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/jobs-api/v3/projects`;
    }

    async getJob(projectId, translationJobUid) {
        return this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/jobs/${translationJobUid}`
        );
    }
}

module.exports = SmartlingJobApi;
