import { AuthApi } from "./auth-api";

export class AccessTokenProvider implements AuthApi {
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
