import { SmartlingApiFactory } from "../api/factory";
import { BulkRequestServiceApi } from "../api/bulk-request";
import { Search } from "../api/bulk-request/parameters/search";

const logger = console;
const projectId = process.env.PROJECT_ID;
const userId = process.env.USER_ID;
const userSecret = process.env.USER_SECRET;

const baseUrl = "https://api.smartling.com";
const apiFactory = new SmartlingApiFactory(userId, userSecret, baseUrl, logger);
const bulkRequestApi = apiFactory.createApiClient(BulkRequestServiceApi, { timeout: 10000 });

(async () => {
    try {
        const assets = await bulkRequestApi.search(
            "contentful-connector",
            projectId,
            new Search()
                .setFilter({
                    spaceId: "q2fjg5qulqq8",
                    assetType: "ENTRY",
                    submissionStatus: "NEW",
                })
                .setSort("updatedAt")
        );

        logger.info(assets);
    } catch (e) {
        console.warn(e);
    }
})();
