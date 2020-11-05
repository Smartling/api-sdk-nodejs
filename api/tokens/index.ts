import SmartlingAuthApi from "../auth";
import SmartlingBaseApi from "../base";
import { TokenDto } from "./dto/token-dto";

export class SmartlingTokensApi extends SmartlingBaseApi {
    private readonly authApi: SmartlingAuthApi;
    private readonly entrypoint: string;

    constructor(authApi: SmartlingAuthApi, logger, smartlingApiBaseUrl: string) {
        super(logger);

        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/tokens-api/v2`;
    }

    public async createProjectLevelApiToken(projectUid: string, tokenName: string, uid: string): Promise<TokenDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/projects/${projectUid}/tokens`,
            JSON.stringify({
                tokenName,
                uid
            })
        );
    }

    public async createAccountLevelApiToken(accountUid: string, tokenName: string, uid: string): Promise<TokenDto> {
        return await this.makeRequest(
            "post",
            `${this.entrypoint}/accounts/${accountUid}/tokens`,
            JSON.stringify({
                tokenName,
                uid
            })
        );
    }
}
