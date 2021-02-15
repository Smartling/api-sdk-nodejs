const SmartlingBaseApi = require("../base");

class SmartlingProjectApi extends SmartlingBaseApi {
    constructor(authApi, logger, smartlingApiBaseUrl) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/projects-api/v2/projects`;
        this.baseUrl = smartlingApiBaseUrl;
    }

    async getProjectDetails(projectId) {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}`
        );
    }

    async fetchProjects() {
        return await this.makeRequest(
            "get",
            `${this.baseUrl}/authorization-api/v2/security-details/projects/search`
        );
    }
}

module.exports = SmartlingProjectApi;
