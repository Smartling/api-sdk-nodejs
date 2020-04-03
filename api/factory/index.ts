import SmartlingAuthApi from "../auth";
import SmartlingBaseApi from "../base";
import { CredentialsDto } from "./dto/credentials-dto";
import { ClientLibMetadataDto } from "./dto/client-lib-metadata-dto";

export class SmartlingApiFactory {
    private authApiClient: SmartlingAuthApi;
    private baseUrl: string;
    private logger: object;
    private clientLibMetadata: ClientLibMetadataDto;

    constructor(
        credentials: CredentialsDto,
        clientLibMetadata: ClientLibMetadataDto,
        baseUrl: string,
        logger?: object
    ) {
        this.authApiClient = new SmartlingAuthApi(
            credentials.userId,
            credentials.userSecret,
            logger,
            baseUrl
        );
        this.baseUrl = baseUrl;
        this.clientLibMetadata = clientLibMetadata;
        this.logger = logger;
    }

    public createApiClient<T extends SmartlingBaseApi>(constructor: new (authApi: SmartlingAuthApi, logger, baseUrl: string) => T, options: object = {}): T {
        const instance = new constructor(this.authApiClient, this.logger, this.baseUrl);

        this.initApiClient(instance, options);

        return instance;
    }

    private initApiClient(apiClient: SmartlingBaseApi, options: object): void {
        apiClient.clientLibId = this.clientLibMetadata.clientLibId;
        apiClient.clientLibVersion = this.clientLibMetadata.clientLibVersion;

        apiClient.setOptions(
            Object.assign(
                options,
                {
                    headers: {
                        "X-SL-ServiceOrigin": apiClient.clientLibId
                    }
                }
            )
        );
    }
}
export default SmartlingApiFactory;
