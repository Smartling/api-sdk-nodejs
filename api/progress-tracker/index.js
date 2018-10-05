const SmartlingBaseApi = require("../base");

class SmartlingProgressTrackerApi extends SmartlingBaseApi {
    constructor(authApi, logger, smartlingApiBaseUrl) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/progress-tracker-api/v2`;
    }

    async createRecord(projectId, spaceId, objectId, data) {
        return this.makeRequest(
            "post",
            `${this.entrypoint}/projects/${projectId}/spaces/${spaceId}/objects/${objectId}/records`,
            JSON.stringify(data)
        );
    }

    async getRecord(projectId, spaceId, objectId, recordId) {
        return this.makeRequest(
            "get",
            `${this.entrypoint}/projects/${projectId}/spaces/${spaceId}/objects/${objectId}/records/${recordId}`
        );
    }

    async getRecords(projectId, spaceId, objectId) {
        return this.makeRequest(
            "get",
            `${this.entrypoint}/projects/${projectId}/spaces/${spaceId}/objects/${objectId}/records`
        );
    }

    async updateRecord(projectId, spaceId, objectId, recordId, data) {
        return this.makeRequest(
            "put",
            `${this.entrypoint}/projects/${projectId}/spaces/${spaceId}/objects/${objectId}/records/${recordId}`,
            JSON.stringify(data)
        );
    }

    async deleteRecord(projectId, spaceId, objectId, recordId) {
        return this.makeRequest(
            "delete",
            `${this.entrypoint}/projects/${projectId}/spaces/${spaceId}/objects/${objectId}/records/${recordId}`
        );
    }

    async deleteRecords(projectId, spaceId, objectId) {
        return this.makeRequest(
            "delete",
            `${this.entrypoint}/projects/${projectId}/spaces/${spaceId}/objects/${objectId}`
        );
    }

    async getToken(accountUid) {
        return this.makeRequest(
            "get",
            `${this.entrypoint}/accounts/${accountUid}/token`
        );
    }
}

module.exports = SmartlingProgressTrackerApi;
