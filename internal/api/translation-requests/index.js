const SmartlingBaseApi = require("../base");

class SmartlingTranslationRequestsApi extends SmartlingBaseApi {
    constructor(authApi, logger, smartlingApiBaseUrl) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/submission-service-api/v2`;
    }

    async createTranslationRequest(projectId, bucketName, params) {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/projects/${projectId}/buckets/${bucketName}/translation-requests`,
            JSON.stringify(params.export())
        );
    }

    async getTranslationRequest(projectId, bucketName, translationRequestUid) {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/projects/${projectId}/buckets/${bucketName}/translation-requests/${translationRequestUid}`
        );
    }

    async updateTranslationRequest(projectId, bucketName, translationRequestUid, params) {
        return await this.makeRequest(
            "put",
            `${this.entrypoint}/projects/${projectId}/buckets/${bucketName}/translation-requests/${translationRequestUid}`,
            JSON.stringify(params.export())
        );
    }

    async searchTranslationRequests(projectId, bucketName, params) {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/projects/${projectId}/buckets/${bucketName}/translation-requests`,
            params.export()
        );
    }
}

module.exports = SmartlingTranslationRequestsApi;
