import SmartlingAuthApi from "../auth";
import SmartlingBaseApi from "../base";
import { RecentlyPublishedFilesParameters } from "./params/recently-published-files-parameters";
import { PublishedFileDto } from "./dto/published-file-dto";
import { Response } from "../http/response";

export class PublishedFilesApi extends SmartlingBaseApi {
    private readonly authApi: SmartlingAuthApi;
    private readonly entrypoint: string;

    constructor(authApi: SmartlingAuthApi, logger, smartlingApiBaseUrl: string) {
        super(logger);

        this.authApi = authApi;
        this.entrypoint = `${smartlingApiBaseUrl}/published-files-api/v2`;
    }

    public async getRecentlyPublishedFiles(projectUid: string, params: RecentlyPublishedFilesParameters): Promise<Response<PublishedFileDto>> {
        return await this.mapItemsToDtos(
            await this.makeRequest(
                "get",
                `${this.entrypoint}/projects/${projectUid}/files/list/recently-published`,
                params.export()
            )
        );
    }

    private mapItemsToDtos(response: Response<object>): Response<PublishedFileDto> {
        const retrievedItems = response.items || [];
        const items: Array<PublishedFileDto> = retrievedItems.map((item) => {
            if (item["publishDate"]) {
                item["publishDate"] = new Date(item["publishDate"]);
            }

            return item as PublishedFileDto;
        });

        return {
            items,
            totalCount: response.totalCount
        };
    }
}
