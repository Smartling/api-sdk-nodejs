import { SmartlingBaseApi } from "../base";
import { SmartlingException } from "../exception";
import { Logger } from "../logger";

/*
    eslint class-methods-use-this: [
        "error", {
            "exceptMethods": [
                "time"
            ]
        }
    ]
 */

export class SmartlingAuthApi extends SmartlingBaseApi {
    private ttlCorrectionSec: number;
    private userIdentifier: string;
    private tokenSecret: string;
    private requestTimestamp: number;

    constructor(userIdentifier: string, tokenSecret: string, logger: Logger, smartlingApiBaseUrl: string) {
        super(logger);
        this.ttlCorrectionSec = 10;
        this.userIdentifier = userIdentifier;
        this.tokenSecret = tokenSecret;
        this.entrypoint = `${smartlingApiBaseUrl}/auth-api/v2`;
        this.requestTimestamp = 0;
    }

    async authenticate() {
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

    async refreshToken() {
        if (this.tokenExists() && this.tokenCanBeRenewed()) {
            this.resetRequestTimeStamp();

            this.logger.debug(`Refresh token with: ${JSON.stringify(this.response)}`);

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

    resetRequestTimeStamp() {
        this.requestTimestamp = this.time();
    }

    tokenExists() {
        /* eslint-disable-next-line no-prototype-builtins */
        return this.response && this.response.hasOwnProperty("accessToken");
    }

    tokenExpired() {
        const tokenExpirationTime = (this.requestTimestamp + this.response.expiresIn)
            - this.ttlCorrectionSec;

        return this.tokenExists() && this.time() > tokenExpirationTime;
    }

    tokenCanBeRenewed() {
        const refreshTokenExpirationTime = (this.requestTimestamp + this.response.refreshExpiresIn)
            - this.ttlCorrectionSec;

        return this.tokenExists() && this.time() < refreshTokenExpirationTime;
    }

    async getAccessToken() {
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

    async getTokenType() {
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

    resetToken() {
        this.requestTimestamp = 0;
        this.response = {};
    }

    /**
     * Returns current timestamp
     * @returns {number}
     */
    time() {
        return Math.floor(Date.now() / 1000);
    }
}
