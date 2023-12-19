import FormData from "form-data";
import { SmartlingBaseApi } from "../base";
import { SmartlingAuthApi } from "../auth";
import { Logger } from "../logger";
import { UploadedFileDto } from "./dto/uploaded-file-dto";
import { UploadFileParameters } from "./params/upload-file-parameters";
import { TranslationDto } from "./dto/translation-dto";
import { TranslateFileParameters } from "./params/translate-file-parameters";
import { TranslationStatusDto } from "./dto/translation-status-dto";
import { LanguageDetectionDto } from "./dto/language-detection-dto";
import { LanguageDetectionStatusDto } from "./dto/language-detection-status-dto";

export class SmartlingFileTranslationsApi extends SmartlingBaseApi {
    constructor(smartlingApiBaseUrl: string, authApi: SmartlingAuthApi, logger: Logger) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/file-translations-api/v2/accounts`;
    }

    async uploadFile(
        accountUid: string, parameters: UploadFileParameters
    ): Promise<UploadedFileDto> {
        const formData = new FormData();
        const exported = parameters.export();

        formData.append("file", exported.file);
        formData.append("request", JSON.stringify(exported.request), {
            contentType: "application/json"
        });

        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${accountUid}/files`,
            formData,
            false,
            SmartlingFileTranslationsApi.fixContentTypeHeaderCase(formData)
        );
    }

    async translateFile(
        accountUid: string, fileUid: string, params: TranslateFileParameters
    ): Promise<TranslationDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${accountUid}/files/${fileUid}/mt`,
            JSON.stringify(params.export())
        );
    }

    async getTranslationProgress(
        accountUid: string, fileUid: string, mtUid: string
    ): Promise<TranslationStatusDto> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${accountUid}/files/${fileUid}/mt/${mtUid}/status`
        );
    }

    async downloadTranslatedFile(
        accountUid: string, fileUid: string, mtUid: string, localeId: string
    ): Promise<string> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${accountUid}/files/${fileUid}/mt/${mtUid}/locales/${localeId}/file`,
            null,
            true
        );
    }

    async downloadTranslatedFiles(
        accountUid: string, fileUid: string, mtUid: string
    ): Promise<string> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${accountUid}/files/${fileUid}/mt/${mtUid}/locales/all/file/zip`,
            null,
            true
        );
    }

    async cancelFileTranslation(
        accountUid: string, fileUid: string, mtUid: string
    ): Promise<void> {
        await this.makeRequest(
            "post",
            `${this.entrypoint}/${accountUid}/files/${fileUid}/mt/${mtUid}/cancel`
        );
    }

    async detectFileLanguage(accountUid: string, fileUid: string): Promise<LanguageDetectionDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${accountUid}/files/${fileUid}/language-detection`
        );
    }

    async getLanguageDetectionProgress(
        accountUid: string, fileUid: string, languageDetectionUid: string
    ): Promise<LanguageDetectionStatusDto> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${accountUid}/files/${fileUid}/language-detection/${languageDetectionUid}/status`
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
