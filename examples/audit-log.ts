import SmartlingAuthApi from "../api/auth";
import SmartlingAuditLogApi from "../api/audit-log";
import CreateAuditLogParameters from "../api/audit-log/params/create-audit-log-parameters";
import SearchAuditLogParams from "../api/audit-log/params/search-audit-log-parameters";

const logger = console;
const accountUid = process.env.ACCOUNT_UID;
const projectId = process.env.PROJECT_ID;
const userId = process.env.USER_ID;
const userSecret = process.env.USER_SECRET;

if (projectId || accountUid) {
    const baseUrl = "https://api.smartling.com";
    const authApi = new SmartlingAuthApi(userId, userSecret, logger, baseUrl);
    const api = new SmartlingAuditLogApi(authApi, logger, baseUrl);
    const baseDescription = "This log was added by sdk example";
    const payload: CreateAuditLogParameters = (new CreateAuditLogParameters())
        .setActionTime(new Date())
        .setActionType("UPLOAD")
        .setClientUserId("sdk-example")
        .setBatchUid("batch-uid");

    const query: SearchAuditLogParams = (new SearchAuditLogParams())
        .setEndTime("now() - 1h");

    (async () => {
        try {
            if (projectId) {
                payload.setDescription(`${baseDescription} (project)`);
                query.setQuery("(project)");

                await api.createProjectLevelLogRecord(projectId, payload);

                logger.info(
                    JSON.stringify(
                        await api.searchProjectLevelLogRecord(projectId, query),
                        null,
                        2
                    )
                );
            }

            if (accountUid) {
                payload.setDescription(`${baseDescription} (account)`);
                query.setQuery("(account)");

                await api.createAccountLevelLogRecord(accountUid, payload);

                logger.info(
                    JSON.stringify(
                        await api.searchAccountLevelLogRecord(accountUid, query),
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
