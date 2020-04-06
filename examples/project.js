const SmartlingProjectApi = require("../api/project");
// eslint-disable-next-line import/no-unresolved
const { SmartlingApiFactory } = require("../api/factory");

const logger = console;
const projectId = process.env.PROJECT_ID;
const userId = process.env.USER_ID;
const userSecret = process.env.USER_SECRET;

if (userId && userSecret) {
    const baseUrl = "https://api.smartling.com";
    const apiFactory = new SmartlingApiFactory(userId, userSecret, baseUrl, logger);
    const smartlingProjectApi = apiFactory.createApiClient(SmartlingProjectApi);

    smartlingProjectApi.clientLibId = "testClientLibId";
    smartlingProjectApi.clientLibVersion = "testClientLibVersion";

    (async () => {
        try {
            const result = await smartlingProjectApi.getProjectDetails(projectId);

            logger.debug(JSON.stringify(result));
        } catch (e) {
            logger.error(e);
        }
    })();
}
