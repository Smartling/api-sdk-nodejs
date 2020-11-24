import SmartlingAuthApi from "../auth";
import SmartlingBaseApi from "../base";
import { Logger } from "../factory/logger";
const packageJson = require("../../package.json");

export class SmartlingApiClientBuilder {
    private authApiClient: SmartlingAuthApi = null;
    private userId: string = null;
    private userSecret: string = null;
    private baseSmartlingApiUrl: string;
    private httpClientOptions: object = {};
    private clientLibId: string = packageJson.name;
    private clientLibVersion: string = packageJson.version;
    private logger: Logger = {
        debug: () => {},
        warn: () => {},
        error: () => {}
    };

    public setLogger(logger: Logger) {
        this.logger = logger;

        return this;
    }

    public setBaseSmartlingApiUrl(baseSmartlingApiUrl: string): SmartlingApiClientBuilder {
        this.baseSmartlingApiUrl = baseSmartlingApiUrl;

        return this;
    }

    public setHttpClientConfiguration(httpClientOptions: object): SmartlingApiClientBuilder {
        this.httpClientOptions = httpClientOptions;

        return this;
    }

    public setClientLibMetadata(clientLibId: string, clientLibVersion: string): SmartlingApiClientBuilder {
        this.clientLibId = clientLibId;
        this.clientLibVersion = clientLibVersion;

        return this;
    }

    public authWithUserIdAndUserSecret(userId: string, userSecret: string): SmartlingApiClientBuilder {
        this.userId = userId;
        this.userSecret = userSecret;

        return this;
    }

    public authWithAuthApiClient(authApiClient: SmartlingAuthApi): SmartlingApiClientBuilder {
        this.authApiClient = authApiClient;

        return this;
    }

    public build<T extends SmartlingBaseApi>(constructor: new (authApi: SmartlingAuthApi, logger, baseUrl: string) => T): T {
        if (this.authApiClient === null && this.userId !== null && this.userSecret !== null) {
            this.authApiClient = new SmartlingAuthApi(
                this.userId,
                this.userSecret,
                this.logger,
                this.baseSmartlingApiUrl
            );

            this.authApiClient["clientLibId"] = this.clientLibId;
            this.authApiClient["clientLibVersion"] = this.clientLibVersion;
        }

        const instance = new constructor(this.authApiClient, this.logger, this.baseSmartlingApiUrl);

        instance["clientLibId"] = this.clientLibId;
        instance["clientLibVersion"] = this.clientLibVersion;

        instance.setOptions(
            Object.assign(
                this.httpClientOptions,
                {
                    headers: {
                        "X-SL-ServiceOrigin": instance["clientLibId"]
                    }
                }
            )
        );

        return instance;
    }
}
