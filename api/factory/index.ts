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

        this.authApiClient.clientLibId = this.clientLibMetadata.clientLibId;
        this.authApiClient.clientLibVersion = this.clientLibMetadata.clientLibVersion;
    }

    public createApiClient<T extends SmartlingBaseApi>(constructor: new (authApi: SmartlingAuthApi, logger, baseUrl: string) => T, options: object = {}): T {
        const instance = new constructor(this.authApiClient, this.logger, this.baseUrl);

        instance.clientLibId = this.clientLibMetadata.clientLibId;
        instance.clientLibVersion = this.clientLibMetadata.clientLibVersion;

        instance.setOptions(
            Object.assign(
                options,
                {
                    headers: {
                        "X-SL-ServiceOrigin": instance.clientLibId
                    }
                }
            )
        );

        return instance;
    }
}
export default SmartlingApiFactory;
