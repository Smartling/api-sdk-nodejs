import SmartlingBaseApi from "../base";

export class SmartlingAuthorizationApi extends SmartlingBaseApi {
    constructor(authApi, logger, smartlingApiBaseUrl) {
        super(logger);
        this.authApi = authApi;
        // Internal API https://wiki.smartling.net/display/DEV/Authorization+API+-+Internal+Use+Only
        this.entrypoint = `${smartlingApiBaseUrl}/authorization-api/v2/security-details`;
    }

    async fetchProjects() {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/projects/search`
        );
    }
}
