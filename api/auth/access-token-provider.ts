export interface AccessTokenProvider {
    getAccessToken(): Promise<string>;
    getTokenType(): Promise<string>;
    resetToken(): void;
}
