const SmartlingBaseApi = require("../base");

class SmartlingProjectApi extends SmartlingBaseApi {
    constructor(authApi, logger, smartlingApiBaseUrl) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/projects-api/v2/projects`;
    }

    async getProjectDetails(projectId) {
        return this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}`
        );
    }
}

module.exports = SmartlingProjectApi;
