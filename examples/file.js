const program = require("commander");
const SmartlingAuthApi = require("../api/auth");
const SmartlingFileApi = require("../api/file");
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
    const smartlingFileApi = new SmartlingFileApi(authApi, logger, "https://api.smartling.com");

    (async () => {
        const projectId = "test";
        const fileUri = "test";

        try {
            let result = await smartlingFileApi.getStatusForAllLocales(projectId, fileUri);
            logger.debug("-------- Get status for all locales ---------");
            logger.debug(JSON.stringify(result));

            result = await smartlingFileApi.getLastModified(projectId, fileUri);
            logger.debug("-------- Get last modified for all locales ---------");
            logger.debug(JSON.stringify(result));
        } catch (e) {
            logger.error(e);
        }
    })();
}
