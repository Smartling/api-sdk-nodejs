const SmartlingProjectApi = require("../api/project");
// eslint-disable-next-line import/no-unresolved
const { SmartlingApiClientBuilder } = require("../api/builder");

const logger = console;
const projectId = process.env.PROJECT_ID;
const userId = process.env.USER_ID;
const userSecret = process.env.USER_SECRET;

if (userId && userSecret) {
    const baseUrl = "https://api.smartling.com";
    const smartlingProjectApi = new SmartlingApiClientBuilder()
        .withLogger(logger)
        .withBaseSmartlingApiUrl(baseUrl)
        .withClientLibMetadata("example-lib-name", "example-liv-version")
        .withHttpClientConfiguration({
            timeout: 10000
        })
        .authWithUserIdAndUserSecret(userId, userSecret)
        .build(SmartlingProjectApi);

    (async () => {
        try {
            const result = await smartlingProjectApi.getProjectDetails(projectId);

            logger.debug(JSON.stringify(result));
        } catch (e) {
            logger.error(e);
        }
    })();
}
