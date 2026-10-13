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
import { CreateTmParameters } from "./params/create-tm-parameters";
import { UpdateTmParameters } from "./params/update-tm-parameters";
import { TmDto } from "./dto/tm-dto";

const TM_FIELDS = `
    tmUid
    name
    description
    sourceLocaleId
    sourceLocale {
        localeId
        localeDescription
        rtlLanguage
        wordSpacing
    }
    creator {
        userUid
        name
    }
    created
    lastModifier {
        userUid
        name
    }
    lastModified
    localeSummary {
        translationLocaleId
        translationLocale {
            localeId
            localeDescription
            rtlLanguage
            wordSpacing
        }
        stringCount
        wordCount
    }
    translationQuality
    managedWordsEnabled
`;

const CREATE_TM_QUERY = `
    mutation createTm($createTm: CreateTm!) {
        createTm(createTm: $createTm) {
            ${TM_FIELDS}
        }
    }
`;

const UPDATE_TM_QUERY = `
    mutation updateTm($updateTm: UpdateTm!) {
        updateTm(updateTm: $updateTm) {
            ${TM_FIELDS}
        }
    }
`;

const DELETE_TM_QUERY = `
    mutation deleteTm($deleteTm: DeleteTm!) {
        deleteTm(deleteTm: $deleteTm) {
            ${TM_FIELDS}
        }
    }
`;

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
        // Guard against re-converting an already-built FormData body: makeRequest() calls
        // alterRequestData() again on a 401 retry, reusing the same opts object.
        if (!(opts.body instanceof FormData)
            && uri.match(/tm-tmx-api\/v2\/accounts\/.*\/tmx\/file$/g)) {
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

    // A 401-triggered retry is not guaranteed byte-safe for a streamed upload
    // (setFileFromLocalFilePath/setFileContent): the underlying Node stream is a one-shot
    // resource, so if it was already partially or fully read by the first attempt, the retried
    // request can go out empty or truncated. This is a pre-existing limitation shared by every
    // alterRequestData-based upload in this SDK (api/job-batches, api/context), not something
    // specific to this method; use setFileContentFromBuffer for a retry-safe upload (a Buffer
    // can be re-read).
    async importTmxFile(
        accountUid: string, params: ImportTmxFileParameters
    ): Promise<TmxImportSummaryDto> {
        const result: TmxImportSummaryDto = await this.makeRequest(
            "post",
            `${this.entrypoint}/tm-tmx-api/v2/accounts/${accountUid}/tmx/file`,
            params.export()
        );

        if (result.translationMemoryImportErrors || result.parsingErrors) {
            this.logger.warn(`importTmxFile completed with partial errors: ${JSON.stringify({
                translationMemoryImportErrors: result.translationMemoryImportErrors,
                parsingErrors: result.parsingErrors
            })}`);
        }

        return result;
    }

    async downloadTmxFile(accountUid: string, tmxFileKey: string): Promise<TranslatedFileDto> {
        const encodedTmxFileKey = encodeURIComponent(tmxFileKey);

        return await SmartlingBaseFileApi.downloadResponseToTranslatedFileDto(
            await this.makeRequest(
                "get",
                `${this.entrypoint}/tm-tmx-api/v2/accounts/${accountUid}/tmx/file/${encodedTmxFileKey}`,
                null,
                ResponseBodyType.RAW_RESPONSE
            )
        );
    }

    async createStringSearch(
        accountUid: string, filter: CreateStringSearchFilterParameters
    ): Promise<CreateStringSearchResultDto | null> {
        return await this.executeGraphQl(
            accountUid,
            CREATE_STRING_SEARCH_QUERY,
            { createStringSearchFilter: filter.export() },
            "createStringSearch"
        );
    }

    async bulkExportTmStrings(
        accountUid: string, params: BulkExportTmStringsParameters
    ): Promise<AsyncActionResultDto | null> {
        return await this.executeGraphQl(
            accountUid,
            BULK_EXPORT_TM_STRINGS_QUERY,
            { bulkExportTmStrings: params.export() },
            "bulkExportTmStrings"
        );
    }

    async getBulkExportTmStringsStatus(
        accountUid: string, actionUid: string
    ): Promise<StringsExportAsyncActionResultDto | null> {
        return await this.executeGraphQl(
            accountUid,
            BULK_EXPORT_TM_STRINGS_STATUS_QUERY,
            { actionUid },
            "bulkExportTmStringsStatus"
        );
    }

    async createTm(accountUid: string, params: CreateTmParameters): Promise<TmDto | null> {
        return await this.executeGraphQl(
            accountUid,
            CREATE_TM_QUERY,
            { createTm: params.export() },
            "createTm"
        );
    }

    async updateTm(accountUid: string, params: UpdateTmParameters): Promise<TmDto | null> {
        return await this.executeGraphQl(
            accountUid,
            UPDATE_TM_QUERY,
            { updateTm: params.export() },
            "updateTm"
        );
    }

    // deleteTm isn't documented on the public GraphQL reference site, but it exists in the real
    // backend schema (tmm.graphqls) with the same non-internal-only doc comment as
    // createTm/updateTm ("Deletes a translation memory"), so it's included here per
    // source-code-wins reconciliation.
    async deleteTm(accountUid: string, tmUid: string): Promise<TmDto | null> {
        return await this.executeGraphQl(
            accountUid,
            DELETE_TM_QUERY,
            { deleteTm: { tmUid } },
            "deleteTm"
        );
    }

    private async executeGraphQl<T>(
        accountUid: string,
        query: string,
        variables: Record<string, unknown>,
        operationName: string
    ): Promise<T | null> {
        const response: Response = await this.makeRequest(
            "post",
            `${this.entrypoint}/tm-graphql-api/v2/accounts/${accountUid}/graphql`,
            JSON.stringify({ query, variables }),
            ResponseBodyType.RAW_RESPONSE
        );

        const requestId = response.headers.get("x-sl-requestid");
        let jsonResponse: { data?: Record<string, unknown>; errors?: Array<unknown> };

        try {
            const textResponse = await response.text();

            // The date reviver only matches these bare key names, not a path - harmless today
            // since no nested field in this domain's DTOs shares them, but worth keeping in mind
            // if a future field reuses "created"/"lastModified" for a non-Date value.
            const parsed = JSON.parse(textResponse, (key, value) => {
                if ((key === "created" || key === "lastModified") && value) {
                    return new Date(value);
                }

                return value;
            });

            if (!parsed || typeof parsed !== "object") {
                throw new SmartlingException(
                    `GraphQL response for operation "${operationName}" is not a JSON object`,
                    { statusCode: response.status, errorResponse: textResponse, requestId }
                );
            }

            jsonResponse = parsed;
        } catch (e) {
            if (e instanceof SmartlingException) {
                throw e;
            }

            this.logger.error(`Couldn't parse GraphQL response json: ${e.toString()}`);

            throw new SmartlingException("Couldn't parse GraphQL response json", {
                statusCode: response.status,
                requestId
            }, e);
        }

        // Redact tmxDownloadKey - it's a bearer-style download token, not safe to log verbatim.
        const redactTmxDownloadKey = (key: string, value: unknown): unknown => (
            key === "tmxDownloadKey" && value ? "[REDACTED]" : value
        );

        this.logger.debug(
            `Received GraphQL response for operation "${operationName}": ${JSON.stringify(jsonResponse, redactTmxDownloadKey)}`
        );

        if (Array.isArray(jsonResponse.errors) && jsonResponse.errors.length > 0) {
            const firstMessage = (jsonResponse.errors[0] as { message?: string })?.message;
            const suffix = firstMessage ? `: ${firstMessage}` : "";

            throw new SmartlingException(
                `GraphQL request for operation "${operationName}" failed${suffix}`,
                {
                    errors: jsonResponse.errors,
                    // Partial data can still be present alongside errors (a nested field-level
                    // resolver error doesn't necessarily mean the mutation's side effect - e.g. a
                    // TM actually being created - didn't happen), so surface it for recovery
                    // rather than discarding it.
                    data: jsonResponse.data,
                    statusCode: response.status,
                    requestId
                }
            );
        }

        if (!jsonResponse.data) {
            throw new SmartlingException(
                `GraphQL response for operation "${operationName}" is missing data`,
                { response: jsonResponse, statusCode: response.status, requestId }
            );
        }

        // The operation's result is itself nullable per the real GraphQL schema (none of this
        // domain's Mutation/Query root fields are declared non-null) - null is a legitimate result,
        // not a malformed response, so it's returned as-is rather than thrown.
        return (jsonResponse.data[operationName] ?? null) as T | null;
    }
}
