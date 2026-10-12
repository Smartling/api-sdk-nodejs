import FormData from "form-data";
import { SmartlingBaseFileApi } from "../base";
import { AccessTokenProvider } from "../auth/access-token-provider";
import { Logger } from "../logger";
import { SmartlingException } from "../exception/index";
import { ResponseBodyType } from "../base/enum/response-body-type";
import { TranslatedFileDto } from "../dto/translated-file-dto";
import { ImportTmxFileParameters } from "./params/import-tmx-file-parameters";
import { TmxImportSummaryDto } from "./dto/tmx-import-summary-dto";
import { CreateStringSearchFilterParameters } from "./params/create-string-search-filter-parameters";
import { CreateStringSearchResultDto } from "./dto/create-string-search-result-dto";
import { BulkExportTmStringsParameters } from "./params/bulk-export-tm-strings-parameters";
import { AsyncActionResultDto } from "./dto/async-action-result-dto";
import { StringsExportAsyncActionResultDto } from "./dto/strings-export-async-action-result-dto";

const CREATE_STRING_SEARCH_QUERY = `
    mutation createStringSearch($createStringSearchFilter: CreateStringSearchFilter!) {
        createStringSearch(createStringSearchFilter: $createStringSearchFilter) {
            searchUid
            stringCount
            wordCount
            duplicateStrings {
                duplicateKey
                count
                srcText
                srcLocale
                translationLocale
            }
            duplicateSearch
            actionUid
            offlineReportUid
        }
    }
`;

const BULK_EXPORT_TM_STRINGS_QUERY = `
    mutation bulkExportTmStrings($bulkExportTmStrings: BulkExportTmStrings!) {
        bulkExportTmStrings(bulkExportTmStrings: $bulkExportTmStrings) {
            actionUid
            totalCount
            processedCount
            errorCount
            executionComplete
            actionStatus
        }
    }
`;

const BULK_EXPORT_TM_STRINGS_STATUS_QUERY = `
    query bulkExportTmStringsStatus($actionUid: ID!) {
        bulkExportTmStringsStatus(actionUid: $actionUid) {
            actionUid
            totalCount
            processedCount
            errorCount
            executionComplete
            tmxDownloadKey
            expired
            actionStatus
        }
    }
`;

export class SmartlingTranslationMemoryApi extends SmartlingBaseFileApi {
    constructor(smartlingApiBaseUrl: string, authApi: AccessTokenProvider, logger: Logger) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = smartlingApiBaseUrl;
    }

    /* eslint-disable-next-line class-methods-use-this */
    alterRequestData(uri: string, opts: Record<string, unknown>): Record<string, unknown> {
        if (uri.match(/tm-tmx-api\/v2\/accounts\/.*\/tmx\/file$/g)) {
            const formData = new FormData();

            Object.keys(opts.body).forEach((key) => {
                if (key === "file" && Buffer.isBuffer(opts.body[key])) {
                    formData.append(key, opts.body[key], {
                        filename: (opts.body as Record<string, string>).fileUri
                    });
                } else {
                    formData.append(key, opts.body[key]);
                }
            });

            opts.headers["Content-Type"] = formData.getHeaders()["content-type"];
            opts.body = formData;
        }

        return opts;
    }

    async importTmxFile(
        accountUid: string, params: ImportTmxFileParameters
    ): Promise<TmxImportSummaryDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/tm-tmx-api/v2/accounts/${accountUid}/tmx/file`,
            params.export()
        );
    }

    async downloadTmxFile(accountUid: string, tmxFileKey: string): Promise<TranslatedFileDto> {
        return await SmartlingBaseFileApi.downloadResponseToTranslatedFileDto(
            await this.makeRequest(
                "get",
                `${this.entrypoint}/tm-tmx-api/v2/accounts/${accountUid}/tmx/file/${tmxFileKey}`,
                null,
                ResponseBodyType.RAW_RESPONSE
            )
        );
    }

    async createStringSearch(
        accountUid: string, filter: CreateStringSearchFilterParameters
    ): Promise<CreateStringSearchResultDto> {
        return await this.executeGraphQl(
            accountUid,
            CREATE_STRING_SEARCH_QUERY,
            { createStringSearchFilter: filter.export() },
            "createStringSearch"
        );
    }

    async bulkExportTmStrings(
        accountUid: string, params: BulkExportTmStringsParameters
    ): Promise<AsyncActionResultDto> {
        return await this.executeGraphQl(
            accountUid,
            BULK_EXPORT_TM_STRINGS_QUERY,
            { bulkExportTmStrings: params.export() },
            "bulkExportTmStrings"
        );
    }

    async getBulkExportTmStringsStatus(
        accountUid: string, actionUid: string
    ): Promise<StringsExportAsyncActionResultDto> {
        return await this.executeGraphQl(
            accountUid,
            BULK_EXPORT_TM_STRINGS_STATUS_QUERY,
            { actionUid },
            "bulkExportTmStringsStatus"
        );
    }

    private async executeGraphQl<T>(
        accountUid: string,
        query: string,
        variables: Record<string, unknown>,
        operationName: string
    ): Promise<T> {
        const response: Response = await this.makeRequest(
            "post",
            `${this.entrypoint}/tm-graphql-api/v2/accounts/${accountUid}/graphql`,
            JSON.stringify({ query, variables }),
            ResponseBodyType.RAW_RESPONSE
        );

        const jsonResponse = await response.json();

        if (jsonResponse.errors) {
            throw new SmartlingException(
                `GraphQL request for operation "${operationName}" failed`,
                { errors: jsonResponse.errors }
            );
        }

        return jsonResponse.data[operationName];
    }
}
