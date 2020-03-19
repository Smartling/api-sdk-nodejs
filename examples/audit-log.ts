import { Command } from "commander5";
import winston from "winston";
import SmartlingAuthApi from "../api/auth";
import SmartlingAuditLogApi from "../api/audit-log";
import AuditLog from "../api/audit-log/auditLog";
import Query from "../api/audit-log/query";

const transports = [
    new winston.transports.Console({
        timestamp: true,
        colorize: true,
        level: "debug"
    })
];
const logger = new winston.Logger({ transports });

const program = new Command();

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

    const payload = new AuditLog(new Date(), "UPLOAD");
    payload.clientUserId = "sdk-example";

    const query = new Query("example");
    query.endTime = "now() - 1h";

    (async () => {
        if (program.projectUid) {
            payload.description = `${baseDescription} (project)`;
            await api.addProjectLog(program.projectUid, payload);
            logger.info(JSON.stringify(await api.getProjectLogs(program.projectUid, query)));
        }
        if (program.accountUid) {
            payload.description = `${baseDescription} (account)`;
            await api.addAccountLog(program.accountUid, payload);
            logger.info(JSON.stringify(await api.getAccountLogs(program.accountUid, query)));
        }
    })();
} else {
    logger.info("Must specify one of projectUid or accountUid");
}
