import SmartlingAuthApi from "../api/auth";
import { SmartlingAuditLogApi } from "../api/audit-log/index";
import { CreateAuditLogParameters } from "../api/audit-log/params/create-audit-log-parameters";
import { SearchAuditLogParameters } from "../api/audit-log/params/search-audit-log-parameters";
import { CredentialsDto } from "../api/factory/dto/credentials-dto";
import { ClientLibMetadataDto } from "../api/factory/dto/client-lib-metadata-dto";
import { SmartlingApiFactory } from "../api/factory/index";

const logger = console;
const accountUid = process.env.ACCOUNT_UID;
const projectId = process.env.PROJECT_ID;
const userId = process.env.USER_ID;
const userSecret = process.env.USER_SECRET;

if (projectId || accountUid) {
    const credentials: CredentialsDto = {
        userId,
        userSecret
    };
    const clientLibMetadata: ClientLibMetadataDto = {
        clientLibId: "testClientLibId",
        clientLibVersion: "testClientLibVersion",
    };
    const baseUrl = "https://api.smartling.com";

    const apiFactory = new SmartlingApiFactory(credentials, clientLibMetadata, baseUrl, logger);
    const api = apiFactory.createApiClient(SmartlingAuditLogApi, { timeout: 10000 });

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
