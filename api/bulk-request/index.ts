import SmartlingAuthApi from "../auth";
import SmartlingBaseApi from "../base";
import { Search as SearchParameters } from "./parameters/search";
import { SearchResult } from "./models/search-result";
import { RequestTranslation } from "./parameters/request-translation";

export class BulkRequestServiceApi extends SmartlingBaseApi {
    private readonly authApi: SmartlingAuthApi;
    private readonly entrypoint: string;

    constructor(authApi: SmartlingAuthApi, logger, smartlingApiBaseUrl: string) {
        super(logger);
        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}`;
    }

    public async search(connector: string, projectUid: string, payload: SearchParameters): Promise<SearchResult[]> {
        return (await this.makeRequest(
            "post",
            `${this.entrypoint}/${connector}-api/v2/projects/${projectUid}/bulk/search`,
            JSON.stringify(payload.export()),
        )).items;
    }

    public async requestTranslation(connector: string, projectUid: string, payload: RequestTranslation): Promise<string> {
        return (await this.makeRequest(
            "post",
            `${this.entrypoint}/${connector}-api/v2/projects/${projectUid}/bulk/translation-requests`,
            JSON.stringify(payload.export())
        )).batchUid;
    }
}
