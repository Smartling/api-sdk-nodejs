import FormData from "form-data";
import { SmartlingBaseApi } from "../base/index";
import { AccessTokenProvider } from "../auth/access-token-provider";
import { Logger } from "../logger";
import { GlossaryDto } from "./dto/glossary-dto";
import { SearchGlossariesParameters } from "./params/search-glossaries-parameters";
import { SmartlingListResponse } from "../http/smartling-list-response";
import { ExportEntriesParameters } from "./params/export-entries-parameters";
import { ResponseBodyType } from "../base/enum/response-body-type";
import { CreateGlossaryParameters } from "./params/create-glossary-parameters";
import { ArchiveGlossariesParameters } from "./params/archive-glossaries-parameters";
import { SearchGlossaryCountsParameters } from "./params/search-glossary-counts-parameters";
import { GlossaryUidsDto } from "./dto/glossary-uids-dto";
import { GlossaryEntriesCountDto } from "./dto/glossary-entries-count-dto";
import { CreateGlossaryEntryParameters } from "./params/create-glossary-entry-parameters";
import { SearchGlossaryEntriesParameters } from "./params/search-glossary-entries-parameters";
import { GlossaryEntryDto } from "./dto/glossary-entry-dto";
import { EntriesBulkActionParameters } from "./params/entries-bulk-action-parameters";
import { EntriesBulkLabelsParameters } from "./params/entries-bulk-labels-parameters";
import { OperationDto } from "./dto/operation-dto";
import { AuthorizeEntriesParameters } from "./params/authorize-entries-parameters";
import { InitializeImportParameters } from "./params/initialize-import-parameters";
import { GlossaryImportResultDto } from "./dto/glossary-import-result-dto";
import { GlossaryImportStatusDto } from "./dto/glossary-import-status-dto";

export class SmartlingGlossariesApi extends SmartlingBaseApi {
    /* eslint-disable-next-line class-methods-use-this */
    alterRequestData(uri: string, opts: Record<string, unknown>): Record<string, unknown> {
        if (uri.match(/glossary-api\/v3\/accounts\/.*\/glossaries\/.*\/import$/g)) {
            if (!opts.body) {
                return opts;
            }

            const formData = new FormData();

            Object.keys(opts.body).forEach((key) => {
                if (Array.isArray(opts.body[key])) {
                    opts.body[key].forEach((value) => {
                        formData.append(`${key}[]`, value);
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

    constructor(smartlingApiBaseUrl: string, authApi: AccessTokenProvider, logger: Logger) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/glossary-api/v3`;
    }

    async searchGlossaries(
        accountUid: string,
        parameters: SearchGlossariesParameters
    ): Promise<SmartlingListResponse<GlossaryDto>> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/accounts/${accountUid}/glossaries/search`,
            JSON.stringify(parameters.export())
        );
    }

    async getGlossary(accountUid: string, glossaryUid: string): Promise<GlossaryDto> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/accounts/${accountUid}/glossaries/${glossaryUid}`
        );
    }

    async createGlossary(
        accountUid: string,
        parameters: CreateGlossaryParameters
    ): Promise<GlossaryDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/accounts/${accountUid}/glossaries`,
            JSON.stringify(parameters.export())
        );
    }

    async updateGlossary(
        accountUid: string,
        glossaryUid: string,
        parameters: CreateGlossaryParameters
    ): Promise<GlossaryDto> {
        return await this.makeRequest(
            "put",
            `${this.entrypoint}/accounts/${accountUid}/glossaries/${glossaryUid}`,
            JSON.stringify(parameters.export())
        );
    }

    async archiveGlossaries(
        accountUid: string,
        parameters: ArchiveGlossariesParameters
    ): Promise<GlossaryUidsDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/accounts/${accountUid}/glossaries/archive`,
            JSON.stringify(parameters.export())
        );
    }

    async restoreGlossaries(
        accountUid: string,
        parameters: ArchiveGlossariesParameters
    ): Promise<GlossaryUidsDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/accounts/${accountUid}/glossaries/unarchive`,
            JSON.stringify(parameters.export())
        );
    }

    async searchGlossariesWithEntriesCounts(
        accountUid: string,
        parameters: SearchGlossaryCountsParameters
    ): Promise<SmartlingListResponse<GlossaryEntriesCountDto>> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/accounts/${accountUid}/glossaries/search/count`,
            JSON.stringify(parameters.export())
        );
    }

    async createGlossaryEntry(
        accountUid: string,
        glossaryUid: string,
        parameters: CreateGlossaryEntryParameters
    ): Promise<GlossaryEntryDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/accounts/${accountUid}/glossaries/${glossaryUid}/entries`,
            JSON.stringify(parameters.export())
        );
    }

    async readGlossaryEntry(
        accountUid: string,
        glossaryUid: string,
        entryUid: string
    ): Promise<GlossaryEntryDto> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/accounts/${accountUid}/glossaries/${glossaryUid}/entries/${entryUid}`
        );
    }

    async updateGlossaryEntry(
        accountUid: string,
        glossaryUid: string,
        entryUid: string,
        parameters: CreateGlossaryEntryParameters
    ): Promise<GlossaryEntryDto> {
        return await this.makeRequest(
            "put",
            `${this.entrypoint}/accounts/${accountUid}/glossaries/${glossaryUid}/entries/${entryUid}`,
            JSON.stringify(parameters.export())
        );
    }

    async searchGlossaryEntries(
        accountUid: string,
        glossaryUid: string,
        parameters: SearchGlossaryEntriesParameters
    ): Promise<SmartlingListResponse<GlossaryEntryDto>> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/accounts/${accountUid}/glossaries/${glossaryUid}/entries/search`,
            JSON.stringify(parameters.export())
        );
    }

    async archiveGlossaryEntries(
        accountUid: string,
        glossaryUid: string,
        parameters: EntriesBulkActionParameters
    ): Promise<OperationDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/accounts/${accountUid}/glossaries/${glossaryUid}/entries/archive`,
            JSON.stringify(parameters.export())
        );
    }

    async restoreGlossaryEntries(
        accountUid: string,
        glossaryUid: string,
        parameters: EntriesBulkActionParameters
    ): Promise<OperationDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/accounts/${accountUid}/glossaries/${glossaryUid}/entries/unarchive`,
            JSON.stringify(parameters.export())
        );
    }

    async removeGlossaryEntries(
        accountUid: string,
        glossaryUid: string,
        parameters: EntriesBulkActionParameters
    ): Promise<OperationDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/accounts/${accountUid}/glossaries/${glossaryUid}/entries/delete`,
            JSON.stringify(parameters.export())
        );
    }

    async addLabelsToGlossaryEntries(
        accountUid: string,
        glossaryUid: string,
        parameters: EntriesBulkLabelsParameters
    ): Promise<OperationDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/accounts/${accountUid}/glossaries/${glossaryUid}/entries/add-labels`,
            JSON.stringify(parameters.export())
        );
    }

    async removeLabelsFromGlossaryEntries(
        accountUid: string,
        glossaryUid: string,
        parameters: EntriesBulkLabelsParameters
    ): Promise<OperationDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/accounts/${accountUid}/glossaries/${glossaryUid}/entries/remove-labels`,
            JSON.stringify(parameters.export())
        );
    }

    async authorizeEntriesForTranslation(
        accountUid: string,
        glossaryUid: string,
        parameters: AuthorizeEntriesParameters
    ): Promise<OperationDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/accounts/${accountUid}/glossaries/${glossaryUid}/entries/authorization`,
            JSON.stringify(parameters.export())
        );
    }

    async initializeGlossaryImport(
        accountUid: string,
        glossaryUid: string,
        parameters: InitializeImportParameters
    ): Promise<GlossaryImportResultDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/accounts/${accountUid}/glossaries/${glossaryUid}/import`,
            parameters.export()
        );
    }

    async importStatus(
        accountUid: string,
        glossaryUid: string,
        importUid: string
    ): Promise<GlossaryImportStatusDto> {
        return await this.makeRequest(
            "get",
            `${this.entrypoint}/accounts/${accountUid}/glossaries/${glossaryUid}/import/${importUid}`
        );
    }

    async confirmGlossaryImport(
        accountUid: string,
        glossaryUid: string,
        importUid: string
    ): Promise<GlossaryImportStatusDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/accounts/${accountUid}/glossaries/${glossaryUid}/import/${importUid}/confirm`
        );
    }

    async exportGlossaryEntries(
        accountUid: string,
        glossaryUid: string,
        parameters: ExportEntriesParameters
    ): Promise<string> {
        return this.makeRequest(
            "post",
            `${this.entrypoint}/accounts/${accountUid}/glossaries/${glossaryUid}/entries/download`,
            JSON.stringify(parameters.export()),
            ResponseBodyType.TEXT
        );
    }
}
