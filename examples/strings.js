const program = require("commander");
const SmartlingAuthApi = require("../api/auth");
const SmartlingStringsApi = require("../api/strings");
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
    const smartlingStringsApi = new SmartlingStringsApi(
        authApi,
        logger,
        "https://api.smartling.com"
    );

    (async () => {
        try {
            const projectId = "test";
            const result = await smartlingStringsApi.getStringsData(projectId, ["test1", "test2"]);

            logger.debug(JSON.stringify(result));
        } catch (e) {
            logger.error(e);
        }
    })();
}
