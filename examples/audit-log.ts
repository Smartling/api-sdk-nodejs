import { createCommand } from "commander";
import winston from "winston";
import SmartlingAuthApi from "../api/auth";
import SmartlingAuditLogApi from "../api/audit-log";
import CreateAuditLogParameters from "../api/audit-log/params/create-audit-log-parameters";
import SearchAuditLogParams from "../api/audit-log/params/search-audit-log-parameters";

const transports = [
    new winston.transports.Console({
        timestamp: true,
        colorize: true,
        level: "debug"
    })
];
const logger = new winston.Logger({ transports });

const program = createCommand();

program
    .version("1.0.0")
    .option("-a, --accountUid <accountUid>", "Account Uid")
    .option("-p, --projectUid <projectUid>", "Project Uid")
    .requiredOption("-t, --secret <secret>", "Token Secret")
    .requiredOption("-u, --identifier <identifier>", "User Identifier")
    .parse(process.argv);

if (program.projectUid || program.accountUid) {
    const baseUrl = "https://api.smartling.com";

    const authApi = new SmartlingAuthApi(program.identifier, program.secret, logger, baseUrl);

    const api = new SmartlingAuditLogApi(authApi, logger, baseUrl);

    const baseDescription = "This log was added by sdk example";

    const payload: CreateAuditLogParameters = (new CreateAuditLogParameters())
        .setActionTime(new Date())
        .setActionType("UPLOAD")
        .setClientUserId("sdk-example")
        .setBatchUid("example-batch-uid");

    const query: SearchAuditLogParams = (new SearchAuditLogParams())
        .setEndTime("now() - 1h");

    (async () => {
        if (program.projectUid) {
            payload.setDescription(`${baseDescription} (project)`);

            await api.createProjectLevelLogRecord(program.projectUid, payload);

            logger.info(JSON.stringify(await api.searchProjectLevelLogRecord(program.projectUid, query)));
        }
        if (program.accountUid) {
            payload.setDescription(`${baseDescription} (account)`);

            await api.createAccountLevelLogRecord(program.accountUid, payload);

            logger.info(JSON.stringify(await api.searchAccountLevelLogRecord(program.accountUid, query)));
        }
    })();
} else {
    logger.info("Must specify one of projectUid or accountUid");
}
