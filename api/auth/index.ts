import { SmartlingBaseApi } from "../base/index";
import { SmartlingException } from "../exception/index";
import { Logger } from "../logger";
import { AccessTokenDto } from "./dto/access-token-dto";

export class SmartlingAuthApi extends SmartlingBaseApi {
    private ttlCorrectionSec: number;
    private userIdentifier: string;
    private tokenSecret: string;
    private requestTimestamp: number;
    private response: AccessTokenDto;

    constructor(
        smartlingApiBaseUrl: string, userIdentifier: string, tokenSecret: string, logger: Logger
    ) {
        super(logger);
        this.ttlCorrectionSec = 10;
        this.userIdentifier = userIdentifier;
        this.tokenSecret = tokenSecret;
        this.entrypoint = `${smartlingApiBaseUrl}/auth-api/v2`;
        this.resetToken();
    }

    async authenticate(): Promise<AccessTokenDto> {
        this.resetRequestTimeStamp();

        return await this.makeRequest(
            "post",
            `${this.entrypoint}/authenticate`,
            JSON.stringify({
                userIdentifier: this.userIdentifier,
                userSecret: this.tokenSecret
            })
        );
    }

    async refreshToken(): Promise<AccessTokenDto> {
        if (this.tokenExists() && this.tokenCanBeRenewed()) {
            this.resetRequestTimeStamp();

            this.logger.debug(`Refresh token with: ${JSON.stringify(this.response, SmartlingBaseApi.sensitiveReplacer)}`);

            return await this.makeRequest(
                "post",
                `${this.entrypoint}/authenticate/refresh`,
                JSON.stringify({
                    refreshToken: this.response.refreshToken
                })
            );
        }

        this.logger.debug(`Can't refresh, doing re-auth with: ${JSON.stringify(this.response)}`);

        return await this.authenticate();
    }

    resetRequestTimeStamp(): void {
        this.requestTimestamp = this.time();
    }

    tokenExists(): boolean {
        /* eslint-disable-next-line no-prototype-builtins */
        return this.response !== null && this.response.hasOwnProperty("accessToken");
    }

    tokenExpired(): boolean {
        if (!this.tokenExists()) {
            return false;
        }

        const tokenExpirationTime = (this.requestTimestamp + this.response.expiresIn)
            - this.ttlCorrectionSec;

        return this.time() > tokenExpirationTime;
    }

    tokenCanBeRenewed(): boolean {
        if (!this.tokenExists()) {
            return false;
        }

        const refreshTokenExpirationTime = (this.requestTimestamp + this.response.refreshExpiresIn)
            - this.ttlCorrectionSec;

        return this.time() < refreshTokenExpirationTime;
    }

    async getAccessToken(): Promise<string> {
        try {
            if (this.tokenExpired()) {
                this.logger.debug("Token expired. Refreshing...");

                this.response = await this.refreshToken();
            }

            if (!this.tokenExists()) {
                this.logger.debug("No token available. Authenticating...");

                this.response = await this.authenticate();
            }

            return this.response.accessToken;
        } catch (e) {
            this.logger.debug(`Request failed. Got: ${e.payload}`);
            this.logger.debug("Token refresh or authentication failed. Final attempt to retrieve access token.");

            try {
                this.response = await this.authenticate();

                return this.response.accessToken;
            } catch (error) {
                throw new SmartlingException("Failed to get access token", error.payload, error);
            }
        }
    }

    async getTokenType(): Promise<string> {
        try {
            if (!this.tokenExists()) {
                this.logger.debug("Requested tokenType but no successful authenticate response received yet. Authenticating...");

                this.response = await this.authenticate();
            }

            return this.response.tokenType;
        } catch (e) {
            this.logger.debug(`Request failed. Got: ${e.payload}`);

            throw new SmartlingException("Failed to get token type", e.payload, e);
        }
    }

    resetToken(): void {
        this.requestTimestamp = 0;
        this.response = null;
    }

    /* eslint-disable-next-line class-methods-use-this */
    time(): number {
        return Math.floor(Date.now() / 1000);
    }
}
