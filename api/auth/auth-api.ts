export interface AuthApi {
    getAccessToken(): Promise<string>;
    getTokenType(): Promise<string>;
    resetToken(): void;
}
