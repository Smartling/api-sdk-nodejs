const SmartlingAuthApi = require("../api/auth");
const SmartlingProgressTrackerApi = require("../api/progress-tracker");

const logger = console;
const projectId = process.env.PROJECT_ID;
const userId = process.env.USER_ID;
const userSecret = process.env.USER_SECRET;

if (userId && userSecret) {
    const authApi = new SmartlingAuthApi(
        userId,
        userSecret,
        logger,
        "https://api.smartling.com"
    );
    const smartlingProgressTrackerApi = new SmartlingProgressTrackerApi(
        authApi,
        logger,
        "https://api.smartling.com"
    );

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
