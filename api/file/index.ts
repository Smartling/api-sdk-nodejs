import SmartlingBaseApi from "../base";
import FormData from 'form-data';
import DownloadFileParameters from "./params/download-file-parameters";

export default class SmartlingFileApi extends SmartlingBaseApi {
    private readonly entrypoint: string;

    constructor(private authApi, logger, smartlingApiBaseUrl: string) {
        super(logger);
        this.entrypoint = `${smartlingApiBaseUrl}/files-api/v2/projects`;
    }

    async getStatusForAllLocales(projectId: string, fileUri: string): Promise<{ directives: { [index: string]: any }, items: [{ localeId: string }], filetype: string; namespace?: { name: string } }> {
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

    async downloadFile(projectId: string, fileUri: string, locale: string, params: DownloadFileParameters): Promise<string> {
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
            SmartlingFileApi.alterHeaders(form)
        );
    }

    async uploadFile(projectId: string, fileUri: string, fileType: string, contents: string, namespace: string = null) {
        const formData = new FormData();
        formData.append('file', contents);
        formData.append('fileUri', fileUri);
        formData.append('fileType', fileType);
        formData.append('smartling.namespace', namespace === null ? fileUri : namespace);

        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${projectId}/file`,
            formData,
            false,
            SmartlingFileApi.alterHeaders(formData),
        );
    }

    private static alterHeaders(form: FormData): { [index: string]: string } {
        const headers = form.getHeaders();

        headers["Content-Type"] = headers["content-type"];
        // eslint-disable-next-line fp/no-delete
        delete headers["content-type"];
        return headers;
    }
}

module.exports = SmartlingFileApi;
