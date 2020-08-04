import SmartlingAuthApi from "../auth";
import SmartlingBaseApi from "../base";
import { Search as SearchParameters } from "./parameters/search";
import { SearchResult } from "./models/search-result";
import { RequestTranslation } from "./parameters/request-translation";
import { SmartlingException } from "../../index";

export class BulkRequestServiceApi extends SmartlingBaseApi {
    private readonly authApi: SmartlingAuthApi;
    private readonly entrypoint: string;

    constructor(authApi: SmartlingAuthApi, logger, smartlingApiBaseUrl: string) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}`;
    }

    public async getSupportedLocales(connector: string, projectUid: string): Promise<string[]> {
        if (connector === "") {
            throw new SmartlingException("connector must not be empty string");
        }
        if (projectUid === "") {
            throw new SmartlingException("projectUid must not be empty string");
        }
        return (await this.makeRequest(
            "get",
            `${this.entrypoint}/${connector}-api/v2/projects/${projectUid}/bulk/supportedLocales`
        )).items;
    }

    public async search(connector: string, projectUid: string, payload: SearchParameters): Promise<SearchResult[]> {
        if (connector === "") {
            throw new SmartlingException("connector must not be empty string");
        }
        if (projectUid === "") {
            throw new SmartlingException("projectUid must not be empty string");
        }
        if (payload === null) {
            throw new SmartlingException("payload must be SearchParameters");
        }
        return (await this.makeRequest(
            "post",
            `${this.entrypoint}/${connector}-api/v2/projects/${projectUid}/bulk/search`,
            JSON.stringify(payload.export()),
        )).items;
    }

    public async requestTranslation(
        connector: string,
        projectUid: string,
        payload: RequestTranslation
    ): Promise<string> {
        if (connector === "") {
            throw new SmartlingException("connector must not be empty string");
        }
        if (projectUid === "") {
            throw new SmartlingException("projectUid must not be empty string");
        }
        if (payload === null) {
            throw new SmartlingException("payload must be RequestTranslation");
        }
        return (await this.makeRequest(
            "post",
            `${this.entrypoint}/${connector}-api/v2/projects/${projectUid}/bulk/translation-requests`,
            JSON.stringify(payload.export())
        )).batchUid;
    }
}
