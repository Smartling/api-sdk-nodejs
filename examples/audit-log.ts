import { Command } from "commander5";
import winston from "winston3";
import SmartlingAuthApi from "../api/auth";
import SmartlingAuditLogApi from "../api/audit-log";
import Payload from "../api/audit-log/payload";

const transports = [
    new winston.transports.Console({
        level: "debug"
    })
];
const makeLogger = () => winston.createLogger({
    level: "debug",
    transports
});

const program = new Command();

program
    .version("1.0.0")
    .option("-a, --accountUid <accountUid>", "Account Uid")
    .option("-p, --projectUid <projectUid>", "Project Uid")
    .requiredOption("-t, --secret <secret>", "Token Secret")
    .requiredOption("-u, --identifier <identifier>", "User Identifier")
    .parse(process.argv);

const logger = makeLogger();

if (program.projectUid || program.accountUid) {
    const baseUrl = "https://api.smartling.com";

    const authApi = new SmartlingAuthApi(program.identifier, program.secret, logger, baseUrl);

    const api = new SmartlingAuditLogApi(authApi, logger, baseUrl);

    const baseDescription = "This log was added by sdk example";

    const payload = new Payload(new Date(), "UPLOAD");
    payload.clientUserId = "sdk-example";

    (async () => {
        if (program.projectUid) {
            payload.description = `${baseDescription} (project)`;
            await api.addProjectLog(program.projectUid, payload);
            logger.info(await api.getProjectLogs(program.projectUid, "example"));
        }
        if (program.accountUid) {
            payload.description = `${baseDescription} (account)`;
            await api.addAccountLog(program.accountUid, payload);
            logger.info(await api.getAccountLogs(program.accountUid, "example"));
        }
    })();
} else {
    logger.info("Must specify one of projectUid or accountUid");
}
