import FormData from "form-data";
import { SmartlingBaseApi } from "../base/index";
import { SmartlingAuthApi } from "../auth/index";
import { Logger } from "../logger";
import { DownloadFileParameters } from "./params/download-file-parameters";
import { UploadFileParameters } from "./params/upload-file-parameters";
import { FileStatusForAllLocalesDto } from "./dto/file-status-for-all-locales-dto";
import { SmartlingListResponse } from "../http/smartling-list-response";
import { LastModifiedForLocale } from "./dto/last-modified-for-locale-dto";
import { UploadedFileDto } from "./dto/uploaded-file-dto";

export class SmartlingFilesApi extends SmartlingBaseApi {
    constructor(smartlingApiBaseUrl: string, authApi: SmartlingAuthApi, logger: Logger) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/files-api/v2/projects`;
    }

    async getStatusForAllLocales(
        projectId: string, fileUri: string
    ): Promise<FileStatusForAllLocalesDto> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/file/status`,
            { fileUri }
        );
    }

    async getLastModified(
        projectId: string, fileUri: string
    ): Promise<SmartlingListResponse<LastModifiedForLocale>> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/file/last-modified`,
            { fileUri }
        );
    }

    async downloadFile(
        projectId: string, fileUri: string, locale: string, params: DownloadFileParameters
    ): Promise<string> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${projectId}/locales/${locale}/file`,
            Object.assign(params.export(), { fileUri }),
            true
        );
    }

    async deleteFile(projectId: string, fileUri: string): Promise<boolean> {
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

    async uploadFile(
        projectId: string, parameters: UploadFileParameters
    ): Promise<UploadedFileDto> {
        const formData = new FormData();
        const exported = parameters.export();
        Object.keys(exported).forEach((key) => {
            formData.append(key, exported[key]);
        });

        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/file`,
            formData,
            false,
            SmartlingFilesApi.fixContentTypeHeaderCase(formData)
        );
    }

    static fixContentTypeHeaderCase(form: FormData): Record<string, unknown> {
        const headers = form.getHeaders();

        headers["Content-Type"] = headers["content-type"];
        // eslint-disable-next-line fp/no-delete
        delete headers["content-type"];
        return headers;
    }
}
