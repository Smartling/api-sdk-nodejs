import SmartlingAuthApi from "../auth";
import SmartlingBaseApi from "../base";

export class BulkRequestServiceApi extends SmartlingBaseApi {
    private readonly authApi: SmartlingAuthApi;
    private readonly entrypoint: string;

    constructor(authApi: SmartlingAuthApi, logger, smartlingApiBaseUrl: string) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}`;
    }

    public async getSupportedLocales(connector: string, projectUid: string): Promise<string[]> {
        if (typeof connector !== "string") {
            throw new SmartlingException("connector must be string");
        }
        if (connector === "") {
            throw new SmartlingException("connector must not be empty string");
        }
        if (typeof projectUid !== "string") {
            throw new SmartlingException("projectUid must be string");
        }
        if (projectUid === "") {
            throw new SmartlingException("projectUid must not be empty string");
        }
        return (await this.makeRequest(
            "get",
            `${this.entrypoint}/connectors-bulk-submit-api/v2/projects/${projectUid}/integrations/${connector}/supported-locales`
        )).items;
    }
}
