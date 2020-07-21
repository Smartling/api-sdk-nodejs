const SmartlingProgressTrackerApi = require("../api/progress-tracker");
// eslint-disable-next-line import/no-unresolved
const { SmartlingApiClientBuilder } = require("../api/builder");

const logger = console;
const projectId = process.env.PROJECT_ID;
const userId = process.env.USER_ID;
const userSecret = process.env.USER_SECRET;

if (userId && userSecret) {
    const baseUrl = "https://api.smartling.com";
    const smartlingProgressTrackerApi = new SmartlingApiClientBuilder()
        .withLogger(logger)
        .withBaseSmartlingApiUrl(baseUrl)
        .withClientLibMetadata("example-lib-name", "example-lib-version")
        .withHttpClientConfiguration({
            timeout: 10000
        })
        .authWithUserIdAndUserSecret(userId, userSecret)
        .build(SmartlingProgressTrackerApi);

    (async () => {
        try {
            const spaceId = "spaceId";
            const objectId = "objectId";

            const createRecordResponse = await smartlingProgressTrackerApi
                .createRecord(projectId, spaceId, objectId, {
                    ttl: 3600,
                    data: {
                        property: "value"
                    }
                });

            await smartlingProgressTrackerApi
                .updateRecord(projectId, spaceId, objectId, createRecordResponse.recordId, {
                    ttl: 5,
                    data: {
                        property: "new_value"
                    }
                });

            await smartlingProgressTrackerApi
                .deleteRecord(projectId, spaceId, objectId, createRecordResponse.recordId);
        } catch (e) {
            logger.error(e);
        }
    })();
}
