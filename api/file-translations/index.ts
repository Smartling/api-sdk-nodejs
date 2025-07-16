import FormData from "form-data";
import { SmartlingBaseApi } from "../base";
import { AccessTokenProvider } from "../auth/access-token-provider";
import { Logger } from "../logger";
import { FtsUploadedFileDto } from "./dto/fts-uploaded-file-dto";
import { FtsUploadFileParameters } from "./params/fts-upload-file-parameters";
import { TranslationDto } from "./dto/translation-dto";
import { TranslateFileParameters } from "./params/translate-file-parameters";
import { TranslationStatusDto } from "./dto/translation-status-dto";
import { LanguageDetectionDto } from "./dto/language-detection-dto";
import { LanguageDetectionStatusDto } from "./dto/language-detection-status-dto";
import { TranslatedFileDto } from "./dto/translated-file-dto";
import { ResponseBodyType } from "../base/enum/response-body-type";
import { LanguageDetectionParameters } from "./params/language-detection-parameters";

export class SmartlingFileTranslationsApi extends SmartlingBaseApi {
    constructor(smartlingApiBaseUrl: string, authApi: AccessTokenProvider, logger: Logger) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/file-translations-api/v2/accounts`;
    }

    async uploadFile(
        accountUid: string, parameters: FtsUploadFileParameters
    ): Promise<FtsUploadedFileDto> {
        const formData = new FormData();
        const exported = parameters.export();

        const fileOptions: Record<string, unknown> = {};
        if (exported.fileName) {
            fileOptions.filename = exported.fileName;
        }
        if (exported.contentType) {
            fileOptions.contentType = exported.contentType;
        }

        formData.append("file", exported.file, fileOptions);
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

    async downloadTranslatedFileWithMetadata(
        accountUid: string, fileUid: string, mtUid: string, localeId: string
    ): Promise<TranslatedFileDto> {
        return await SmartlingFileTranslationsApi.downloadResponseToTranslatedFileDto(
            await this.makeRequest(
                "get",
                `${this.entrypoint}/${accountUid}/files/${fileUid}/mt/${mtUid}/locales/${localeId}/file`,
                null,
                ResponseBodyType.RAW_RESPONSE
            )
        );
    }

    async downloadTranslatedFiles(
        accountUid: string, fileUid: string, mtUid: string
    ): Promise<ArrayBuffer> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/${accountUid}/files/${fileUid}/mt/${mtUid}/locales/all/file/zip`,
            null,
            ResponseBodyType.ARRAY_BUFFER
        );
    }

    async downloadTranslatedFilesWithMetadata(
        accountUid: string, fileUid: string, mtUid: string
    ): Promise<TranslatedFileDto> {
        return await SmartlingFileTranslationsApi.downloadResponseToTranslatedFileDto(
            await this.makeRequest(
                "get",
                `${this.entrypoint}/${accountUid}/files/${fileUid}/mt/${mtUid}/locales/all/file/zip`,
                null,
                ResponseBodyType.RAW_RESPONSE
            )
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

    async detectFileLanguage(
        accountUid: string, fileUid: string, params?: LanguageDetectionParameters
    ): Promise<LanguageDetectionDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${accountUid}/files/${fileUid}/language-detection`,
            JSON.stringify(params?.export())
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

    private static async downloadResponseToTranslatedFileDto(
        response: Response
    ): Promise<TranslatedFileDto> {
        const contentType = response.headers.get("content-type") ?? undefined;
        const contentDisposition = response.headers.get("content-disposition");
        let fileName;
        if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename="((?:[^"\\]|\\.)*)"/);
            if (fileNameMatch) {
                fileName = fileNameMatch[1].replace(/\\"/g, "\"");
            }
        }
        return {
            fileContent: await response.arrayBuffer(),
            fileName,
            contentType
        };
    }
}
