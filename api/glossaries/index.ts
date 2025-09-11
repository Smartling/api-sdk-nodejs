import { SmartlingBaseApi } from "../base/index";
import { AccessTokenProvider } from "../auth/access-token-provider";
import { Logger } from "../logger";
import { GlossaryDto } from "./dto/glossary-dto";
import { SearchGlossariesParameters } from "./params/search-glossaries-parameters";
import { SmartlingListResponse } from "../http/smartling-list-response";
import { ExportEntriesParameters } from "./params/export-entries-parameters";

export class SmartlingGlossariesApi extends SmartlingBaseApi {
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

    async exportGlossaryEntries(
        accountUid: string,
        glossaryUid: string,
        parameters: ExportEntriesParameters
    ): Promise<void> {
        await this.makeRequest(
            "post",
            `${this.entrypoint}/accounts/${accountUid}/glossaries/${glossaryUid}/entries/download`,
            JSON.stringify(parameters.export())
        );
    }
}
