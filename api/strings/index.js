const SmartlingBaseApi = require("../base");

/*
    eslint class-methods-use-this: [
        "error", {
            "exceptMethods": [
                "buildQuery"
            ]
        }
    ]
 */

class SmartlingStringsApi extends SmartlingBaseApi {
    constructor(authApi, logger, smartlingApiBaseUrl) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/strings-search-api/v2/projects`;
    }

    buildQuery(hashCodes) {
        const baseQuery = "(active:true AND deleted:false)";

        if (!Array.isArray(hashCodes)) {
            return `${baseQuery} AND hashcode:null`;
        }

        return `${baseQuery} AND (${hashCodes.map(value => `hashcode:${value}`).join(" OR ")})`;
    }

    async getStringsData(projectId, hashCodes) {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/string-data`,
            JSON.stringify({
                query: this.buildQuery(hashCodes)
            })
        );
    }
}

module.exports = SmartlingStringsApi;
