import { SmartlingBaseApi } from "../base";
import { SmartlingAuthApi } from "../auth";
import FormData from "form-data";

export class SmartlingFilesApi extends SmartlingBaseApi {
    constructor(authApi: SmartlingAuthApi, logger, smartlingApiBaseUrl: string) {
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
            SmartlingFilesApi.fixContentTypeHeaderCase(form)
        );
    }

    async uploadFile(projectId, parameters) {
        const formData = new FormData();
        const exported = parameters.export();
        Object.keys(exported).forEach((key) => {
            if (key === "file") {
                formData.append(key, exported[key], "file");
            } else {
                formData.append(key, exported[key]);
            }
        });

        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/file`,
            formData,
            false,
            SmartlingFilesApi.fixContentTypeHeaderCase(formData),
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