import { SmartlingApiClientBuilder } from "../api/builder";
import { BulkRequestServiceApi } from "../api/bulk-request";
import { Search } from "../api/bulk-request/parameters/search";

const logger = console;
const projectId = process.env.PROJECT_ID;
const userId = process.env.USER_ID;
const userSecret = process.env.USER_SECRET;
const spaceId = process.env.SPACE_ID;
const submissionStatus = process.env.SUBMISSION_STATUS || "NOT_TRANSLATED";

const baseUrl = "https://api.smartling.com";
const bulkRequestApi = new SmartlingApiClientBuilder()
    .withLogger(logger)
    .setBaseSmartlingApiUrl(baseUrl)
    .setClientLibMetadata("example-lib-name", "example-lib-version")
    .setHttpClientConfiguration({
        timeout: 10000
    })
    .authWithUserIdAndUserSecret(userId, userSecret)
    .build(BulkRequestServiceApi);

(async () => {
    try {
        const assets = await bulkRequestApi.search(
            "contentful-connector",
            projectId,
            new Search()
                .setFilter({
                    assetType: "ENTRY",
                    spaceId,
                    submissionStatus,
                })
                .setSort("updatedAt")
        );

        logger.info(assets);
    } catch (e) {
        console.warn(e);
    }
})();
