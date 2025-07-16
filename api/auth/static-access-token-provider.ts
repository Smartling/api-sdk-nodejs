import { AccessTokenProvider } from "./access-token-provider";

export class StaticAccessTokenProvider implements AccessTokenProvider {
    constructor(
        private readonly accessToken: string,
        private readonly tokenType: string,
    ) {}

    async getAccessToken(): Promise<string> {
        return this.accessToken;
    }

    async getTokenType(): Promise<string> {
        return this.tokenType;
    }

    resetToken(): void {}
}
