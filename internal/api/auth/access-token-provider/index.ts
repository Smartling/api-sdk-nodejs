import SmartlingAuthApi from "../../auth";

export class AccessTokenProvider extends SmartlingAuthApi {
    private readonly tokenType : string;
    private readonly accessToken: string;

    constructor(accessToken: string, tokenType: string = "Bearer") {
        super();

        this.accessToken = accessToken;
        this.tokenType = tokenType;
    }

    async getAccessToken() {
        return this.accessToken;
    }

    async getTokenType() {
        return this.tokenType;
    }

    async refreshToken() {}
}
