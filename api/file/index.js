const SmartlingBaseApi = require("../base");

class SmartlingFileApi extends SmartlingBaseApi {
    constructor(authApi, logger, smartlingApiBaseUrl) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/files-api/v2/projects`;
    }

    async getStatusForAllLocales(projectId, fileUri) {
        return this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/file/status`,
            { fileUri }
        );
    }

    async getLastModified(projectId, fileUri) {
        return this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/file/last-modified`,
            { fileUri }
        );
    }

    async downloadFile(projectId, fileUri, locale, params) {
        return this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/locales/${locale}/file`,
            Object.assign(params.export(), { fileUri }),
            true
        );
    }
}

module.exports = SmartlingFileApi;
