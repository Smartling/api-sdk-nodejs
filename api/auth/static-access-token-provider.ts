import { AccessTokenProvider } from "./access-token-provider";

export class StaticAccessTokenProvider implements AccessTokenProvider {
    private accessToken: string;
    private tokenType: string;

    constructor(
        accessToken: string,
        tokenType: string
    ) {
        this.accessToken = accessToken;
        this.tokenType = tokenType;
    }

    async getAccessToken(): Promise<string> {
        return this.accessToken;
    }

    async getTokenType(): Promise<string> {
        return this.tokenType;
    }

    resetToken(): void {
        this.accessToken = null;
        this.tokenType = null;
    }
}
