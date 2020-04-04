import { SmartlingAuditLogApi } from "../api/audit-log/index";
import { CreateAuditLogParameters } from "../api/audit-log/params/create-audit-log-parameters";
import { SearchAuditLogParameters } from "../api/audit-log/params/search-audit-log-parameters";
import { SmartlingApiFactory } from "../api/factory/index";

const logger = console;
const accountUid = process.env.ACCOUNT_UID;
const projectId = process.env.PROJECT_ID;
const userId = process.env.USER_ID;
const userSecret = process.env.USER_SECRET;

if (projectId || accountUid) {
    const baseUrl = "https://api.smartling.com";
    const apiFactory = new SmartlingApiFactory(userId, userSecret, baseUrl, logger);
    const smartlingAuditLogApi = apiFactory.createApiClient(SmartlingAuditLogApi, { timeout: 10000 });

    smartlingAuditLogApi.clientLibId = "testClientLibId";
    smartlingAuditLogApi.clientLibVersion = "testClientLibVersion";

    const baseDescription = "This log was added by sdk example";
    const payload: CreateAuditLogParameters = (
        new CreateAuditLogParameters(
            new Date(),
            "UPLOAD"
        )
    )
        .setClientUserId("sdk-example")
        .setBatchUid("batch-uid");

    const query: SearchAuditLogParameters = (new SearchAuditLogParameters())
        .setEndTime("now() - 1h");

    (async () => {
        try {
            if (projectId) {
                payload.setDescription(`${baseDescription} (project)`);
                query.setQuery("(project)");

                await smartlingAuditLogApi.createProjectLevelLogRecord(projectId, payload);

                logger.info(
                    JSON.stringify(
                        await smartlingAuditLogApi.searchProjectLevelLogRecord(projectId, query),
                        null,
                        2
                    )
                );
            }

            if (accountUid) {
                payload.setDescription(`${baseDescription} (account)`);
                query.setQuery("(account)");

                await smartlingAuditLogApi.createAccountLevelLogRecord(accountUid, payload);

                logger.info(
                    JSON.stringify(
                        await smartlingAuditLogApi.searchAccountLevelLogRecord(accountUid, query),
                        null,
                        2
                    )
                );
            }
        } catch (e) {
            console.warn(e);
        }
    })();
} else {
    logger.info("Must specify one of projectUid or accountUid");
}
