import { SmartlingTokensApi } from "../api/tokens/index";
import { SmartlingApiClientBuilder } from "../api/builder";

const logger = console;
const projectId = process.env.PROJECT_ID;
const accountUid = process.env.ACCOUNT_UID;
const userId = process.env.USER_ID;
const userSecret = process.env.USER_SECRET;

if (projectId && accountUid) {
    const baseUrl = "https://api.smartling.com";
    const tokensApi = new SmartlingApiClientBuilder()
        .setLogger(logger)
        .setBaseSmartlingApiUrl(baseUrl)
        .setClientLibMetadata("example-lib-name", "example-lib-version")
        .setHttpClientConfiguration({
            timeout: 10000
        })
        .authWithUserIdAndUserSecret(userId, userSecret)
        .build(SmartlingTokensApi);

    (async () => {
        try {
            logger.info(
                await tokensApi.createAccountLevelApiToken(accountUid, "testTokenExample", "#".repeat(12))
            );

            logger.info(
                await tokensApi.createProjectLevelApiToken(projectId, "testTokenExample", "#".repeat(12))
            );
        } catch (e) {
            console.log(e);
        }
     })();
} else {
    logger.info("Must specify projectUid and accountUid");
}
