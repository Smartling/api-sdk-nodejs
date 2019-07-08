const SmartlingBaseApi = require("../base");

class SmartlingJobFacadeApi extends SmartlingBaseApi {
    constructor(authApi, logger, smartlingApiBaseUrl) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/jobs-batch-api/v1/projects`;
    }

    async getBatchStatus(projectId, batchUid) {
        return this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/batches/${batchUid}`
        );
    }
}

module.exports = SmartlingJobFacadeApi;
