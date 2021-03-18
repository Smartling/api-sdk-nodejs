const SmartlingBaseApi = require("../base");
const FormData = require("form-data");

class SmartlingFileApi extends SmartlingBaseApi {
    constructor(authApi, logger, smartlingApiBaseUrl) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/files-api/v2/projects`;
    }

    async getStatusForAllLocales(projectId, fileUri) {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/file/status`,
            { fileUri }
        );
    }

    async getLastModified(projectId, fileUri) {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/file/last-modified`,
            { fileUri }
        );
    }

    async downloadFile(projectId, fileUri, locale, params) {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/locales/${locale}/file`,
            Object.assign(params.export(), { fileUri }),
            true
        );
    }

    async deleteFile(projectId, fileUri) {
        const form = new FormData();

        form.append("fileUri", fileUri);

        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/file/delete`,
            form,
            false,
            SmartlingFileApi.fixContentTypeHeaderCase(form)
        );
    }

    async uploadFile(projectId, parameters) {
        const formData = new FormData();
        formData.append("file", parameters.file);
        formData.append("fileUri", parameters.fileUri);
        formData.append("fileType", parameters.fileType);
        formData.append("smartling.namespace", parameters["smartling.namespace"]);

        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/file`,
            formData,
            false,
            SmartlingFileApi.fixContentTypeHeaderCase(formData),
        );
    }

    static fixContentTypeHeaderCase(form) {
        const headers = form.getHeaders();

        headers["Content-Type"] = headers["content-type"];
        // eslint-disable-next-line fp/no-delete
        delete headers["content-type"];
        return headers;
    }
}

module.exports = SmartlingFileApi;
