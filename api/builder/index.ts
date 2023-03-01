import { SmartlingAuthApi } from "../auth/index";
import { SmartlingBaseApi } from "../base/index";
import { Logger } from "../logger";

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const packageJson = require("../../package.json");

export class SmartlingApiClientBuilder {
    protected authApiClient: SmartlingAuthApi = null;
    protected userId: string = null;
    protected userSecret: string = null;
    protected baseSmartlingApiUrl: string;
    protected httpClientOptions: Record<string, unknown> = {};
    protected clientLibId: string = packageJson.name;
    protected clientLibVersion: string = packageJson.version;
    protected logger: Logger = {
        /* eslint-disable-next-line @typescript-eslint/no-empty-function */
        debug: () => {},
        /* eslint-disable-next-line @typescript-eslint/no-empty-function */
        warn: () => {},
        /* eslint-disable-next-line @typescript-eslint/no-empty-function */
        error: () => {}
    };

    public setLogger(logger: Logger): SmartlingApiClientBuilder {
        this.logger = logger;

        return this;
    }

    public setBaseSmartlingApiUrl(baseSmartlingApiUrl: string): SmartlingApiClientBuilder {
        this.baseSmartlingApiUrl = baseSmartlingApiUrl;

        return this;
    }

    public setHttpClientConfiguration(
        httpClientOptions: Record<string, unknown>
    ): SmartlingApiClientBuilder {
        this.httpClientOptions = httpClientOptions;

        return this;
    }

    public setClientLibMetadata(
        clientLibId: string, clientLibVersion: string
    ): SmartlingApiClientBuilder {
        this.clientLibId = clientLibId;
        this.clientLibVersion = clientLibVersion;

        return this;
    }

    public authWithUserIdAndUserSecret(
        userId: string, userSecret: string
    ): SmartlingApiClientBuilder {
        this.userId = userId;
        this.userSecret = userSecret;

        return this;
    }

    public authWithAuthApiClient(authApiClient: SmartlingAuthApi): SmartlingApiClientBuilder {
        this.authApiClient = authApiClient;

        return this;
    }

    public build<T extends SmartlingBaseApi>(
        constructor: new (baseUrl: string, authApi: SmartlingAuthApi, logger) => T
    ): T {
        if (this.authApiClient === null && this.userId !== null && this.userSecret !== null) {
            this.authApiClient = new SmartlingAuthApi(
                this.baseSmartlingApiUrl,
                this.userId,
                this.userSecret,
                this.logger
            );

            this.authApiClient.setClientLibId(this.clientLibId);
            this.authApiClient.setClientLibVersion(this.clientLibVersion);
            this.authApiClient.setOptions(this.httpClientOptions);
        }

        const instance = new constructor(this.baseSmartlingApiUrl, this.authApiClient, this.logger);

        instance.setClientLibId(this.clientLibId);
        instance.setClientLibVersion(this.clientLibVersion);
        instance.setOptions(this.httpClientOptions);

        return instance;
    }
}
