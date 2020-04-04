import SmartlingAuthApi from "../auth";
import SmartlingBaseApi from "../base";

export class SmartlingApiFactory {
    private authApiClient: SmartlingAuthApi;
    private baseUrl: string;
    private logger: object;

    constructor(
        userId: string,
        userSecret: string,
        baseUrl: string,
        logger: object = {
            debug: () => {},
            warn: () => {},
            error: () => {}
        }
    ) {
        this.authApiClient = new SmartlingAuthApi(
            userId,
            userSecret,
            logger,
            baseUrl
        );
        this.baseUrl = baseUrl;
        this.logger = logger;
    }

    public createApiClient<T extends SmartlingBaseApi>(constructor: new (authApi: SmartlingAuthApi, logger, baseUrl: string) => T, options: object = {}): T {
        const instance = new constructor(this.authApiClient, this.logger, this.baseUrl);

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
