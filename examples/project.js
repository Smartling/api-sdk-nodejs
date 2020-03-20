const SmartlingAuthApi = require("../api/auth");
const SmartlingProjectApi = require("../api/project");

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
    const smartlingProjectApi = new SmartlingProjectApi(
        authApi,
        logger,
        "https://api.smartling.com"
    );

    (async () => {
        try {
            const result = await smartlingProjectApi.getProjectDetails(projectId);

            logger.debug(JSON.stringify(result));
        } catch (e) {
            logger.error(e);
        }
    })();
}
