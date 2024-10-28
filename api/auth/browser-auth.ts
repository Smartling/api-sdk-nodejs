import { SmartlingAuthApi } from './index';
import { AccessTokenDto } from './dto/access-token-dto';
import { AuthStorageProvider } from './storage-provider';
import { Logger } from '../logger';
import { DefaultStorageProvider } from './default-storage-provider';

export abstract class BrowserAuthProvider extends SmartlingAuthApi {
    protected storageProvider: AuthStorageProvider;
    private integrationType: string = 'general';
    private tokenTimer: number;

    private AuthTimeout = 20000;
    constructor(
        authBaseUrl: string,
        logger: Logger,
        storageProvider?: AuthStorageProvider
    ) {
        super(authBaseUrl, null, null, logger);
        if (storageProvider) {
            this.storageProvider = storageProvider;
        } else {
            this.storageProvider = new DefaultStorageProvider();
        }
    }

    abstract openBrowserWindow(url: string): void;

    // TODO: make it enum
    setIntegrationType(integrationType: string) {
        this.integrationType = integrationType;
    }
    async authenticate(): Promise<AccessTokenDto>  {
        if (!(await this.isAuthenticated())) {
            await this.fetchRequestId();

            const startTime = Date.now();
            while (true) {
                const isUserAuthenticated: boolean = await this.isAuthenticated();
                if (Date.now() - startTime >= this.AuthTimeout || isUserAuthenticated) {
                    break;
                }
                await new Promise((r) => setTimeout(r, 2000));
            }
        }

        return await this.storageProvider.getTokenData() as AccessTokenDto;
    }

    async getAccessToken(): Promise<string> {
        const tokens = await this.storageProvider.getTokenData();
        if (this.tokenValid(tokens)) {
            return tokens.accessToken;
        } else if (tokens && tokens.refreshToken) {
            const authData = await this.refreshToken();
            return authData ? authData.accessToken : null;
        }
        return null;
    }

    async getTokenType(): Promise<string> {
        return 'Bearer';
    }

    async refreshToken(): Promise<AccessTokenDto> {
        const tokenData = await this.storageProvider.getTokenData();
        if (tokenData && tokenData.refreshToken) {
            const tokenType = await this.getTokenType();
            const refreshTokenResponse = await this.makeRequest("GET", `${this.entrypoint}/plugin-api/v2/refresh2`, undefined, false, {
                Authorization: `${tokenType} ${tokenData.refreshToken}`
            });
            await this.storageProvider.setTokenData(refreshTokenResponse);
            return refreshTokenResponse;
        }
    }

    resetToken(): Promise<void> {
        return this.storageProvider.clearTokenData();
    }

    async isAuthenticated(): Promise<boolean> {
        const tokenData = await this.storageProvider.getTokenData();
        return this.tokenValid(tokenData);
    }

    async fetchRequestId() {
        const res = await this.makeRequest('GET',`${this.entrypoint}/plugin-api/v2/request-id`);


        const { requestId } = res;

        this.tokenTimer = setInterval(() => {
            this.requestUserData(requestId);
        }, 2000);

        this.openBrowserWindow(`https://connect.smartling.com/${this.integrationType}/login/${requestId}`);
    }

    async requestUserData(requestId: string): Promise<void> {
        try {

            const res = await this.makeRequest('GET', `${this.entrypoint}/plugin-api/v2/auth//${requestId}`);

            if (res) {
                clearInterval(this.tokenTimer);

                await this.storageProvider.setTokenData(res);
            }
        } catch (e) {

        }
    }

    tokenValid(tokenData: Partial<AccessTokenDto>): boolean {
        return tokenData && tokenData.accessToken && (tokenData.expiresIn > Date.now());
    }

}
