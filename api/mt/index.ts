import { SmartlingBaseApi } from "../base/index";
import { AuthApi } from "../auth/auth-api";
import { Logger } from "../logger";
import { SmartlingMTParameters } from "./params/smartling-mt-parameters";
import { SmartlingListResponse } from "../http/smartling-list-response";
import { TranslationTextItemDto } from "./dto/translation-text-item-dto";

export class SmartlingMachineTranslationsApi extends SmartlingBaseApi {
    constructor(smartlingApiBaseUrl: string, authApi: AuthApi, logger: Logger) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/mt-router-api/v2/accounts`;
    }

    async translate(
        accountUid: string,
        params: SmartlingMTParameters
    ): Promise<SmartlingListResponse<TranslationTextItemDto>> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/${accountUid}/smartling-mt`,
            JSON.stringify(params.export())
        );
    }
}
