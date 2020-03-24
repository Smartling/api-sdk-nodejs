const SmartlingAuthApi = require("../api/auth");
const SmartlingStringsApi = require("../api/strings");

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
    const smartlingStringsApi = new SmartlingStringsApi(
        authApi,
        logger,
        "https://api.smartling.com"
    );

    (async () => {
        try {
            const result = await smartlingStringsApi.getStringsData(projectId, ["test1", "test2"]);

            logger.debug(JSON.stringify(result));
        } catch (e) {
            logger.error(e);
        }
    })();
}
