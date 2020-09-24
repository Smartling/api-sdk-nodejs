import { PublishedFilesApi } from "../api/published-files/index";
import { RecentlyPublishedFilesParameters } from "../api/published-files/params/recently-published-files-parameters";
import { SmartlingApiClientBuilder } from "../api/builder";

const logger = console;
const accountUid = process.env.ACCOUNT_UID;
const projectId = process.env.PROJECT_ID;
const userId = process.env.USER_ID;
const userSecret = process.env.USER_SECRET;

if (projectId || accountUid) {
    const baseUrl = "https://api.smartling.com";
    const publishedFilesApi = new SmartlingApiClientBuilder()
        .setLogger(logger)
        .setBaseSmartlingApiUrl(baseUrl)
        .setClientLibMetadata("example-lib-name", "example-lib-version")
        .setHttpClientConfiguration({
            timeout: 10000
        })
        .authWithUserIdAndUserSecret(userId, userSecret)
        .build(PublishedFilesApi);

    const params: RecentlyPublishedFilesParameters = (new RecentlyPublishedFilesParameters())
        .setPublishedAfterDate(new Date("2020-09-24T00:00:00Z"));

    (async () => {
        try {
            await publishedFilesApi.getRecentlyPublishedFiles(projectId, params);

            logger.info(
                JSON.stringify(
                    await publishedFilesApi.getRecentlyPublishedFiles(projectId, params),
                    null,
                    2
                )
            );
        } catch (e) {
            console.log(e);
        }
     })();
} else {
    logger.info("Must specify one of projectUid or accountUid");
}
