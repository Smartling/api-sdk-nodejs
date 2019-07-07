const program = require("commander");
const SmartlingAuthApi = require("../api/auth");
const SmartlingJobFacadeApi = require("../api/job-facade");
const winston = require("winston");

const transports = [
    new winston.transports.Console({
        timestamp: true,
        colorize: true,
        level: "debug"
    })
];
const logger = new winston.Logger({ transports });

program
    .version("0.0.1")
    .option("-u, --identifier <identifier>", "User Identifier")
    .option("-t, --secret <secret>", "Token Secret")
    .parse(process.argv);

if (program.identifier && program.secret) {
    const authApi = new SmartlingAuthApi(
        program.identifier,
        program.secret,
        logger,
        "https://api.smartling.com"
    );
    const smartlingJobFacadeApi = new SmartlingJobFacadeApi(authApi, logger, "https://api.smartling.com");

    (async () => {
        const projectId = "test";
        const batchUid = "test";

        try {
            const result = await smartlingJobFacadeApi.getBatchStatus(projectId, batchUid);
            logger.debug("-------- Get batch status ---------");
            logger.debug(JSON.stringify(result));
        } catch (e) {
            logger.error(e);
        }
    })();
}
