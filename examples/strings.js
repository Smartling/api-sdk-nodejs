const SmartlingStringsApi = require("../api/strings");
const { SmartlingApiFactory } = require("../api/factory");

const logger = console;
const projectId = process.env.PROJECT_ID;
const userId = process.env.USER_ID;
const userSecret = process.env.USER_SECRET;

if (userId && userSecret) {
    const baseUrl = "https://api.smartling.com";
    const apiFactory = new SmartlingApiFactory(userId, userSecret, baseUrl, logger);
    const smartlingStringsApi = apiFactory.createApiClient(SmartlingStringsApi);

    smartlingStringsApi.clientLibId = "testClientLibId";
    smartlingStringsApi.clientLibVersion = "testClientLibVersion";

    (async () => {
        try {
            const result = await smartlingStringsApi.getStringsData(projectId, ["test1", "test2"]);

            logger.debug(JSON.stringify(result));
        } catch (e) {
            logger.error(e);
        }
    })();
}
