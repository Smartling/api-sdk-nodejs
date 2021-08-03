import FormData from "form-data";
import { SmartlingBaseApi } from "../base";
import { SmartlingAuthApi } from "../auth";
import { Logger } from "../logger";
import { DownloadFileParameters } from "./params/download-file-parameters";
import { UploadFileParameters } from "./params/upload-file-parameters";

export class SmartlingFilesApi extends SmartlingBaseApi {
    constructor(authApi: SmartlingAuthApi, logger: Logger, smartlingApiBaseUrl: string) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/files-api/v2/projects`;
    }

    async getStatusForAllLocales(projectId: string, fileUri: string) {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/file/status`,
            { fileUri }
        );
    }

    async getLastModified(projectId: string, fileUri: string) {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/file/last-modified`,
            { fileUri }
        );
    }

    async downloadFile(
        projectId: string, fileUri: string, locale: string, params: DownloadFileParameters
    ) {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/locales/${locale}/file`,
            Object.assign(params.export(), { fileUri }),
            true
        );
    }

    async deleteFile(projectId: string, fileUri: string) {
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

    async uploadFile(projectId: string, parameters: UploadFileParameters) {
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
            SmartlingFilesApi.fixContentTypeHeaderCase(formData)
        );
    }

    static fixContentTypeHeaderCase(form: FormData) {
        const headers = form.getHeaders();

        headers["Content-Type"] = headers["content-type"];
        // eslint-disable-next-line fp/no-delete
        delete headers["content-type"];
        return headers;
    }
}
