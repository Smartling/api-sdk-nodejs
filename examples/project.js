const program = require("commander");
const SmartlingAuthApi = require("../api/auth");
const SmartlingProjectApi = require("../api/project");
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
    const smartlingProjectApi = new SmartlingProjectApi(
        authApi,
        logger,
        "https://api.smartling.com"
    );

    (async () => {
        try {
            const projectId = "test";
            const result = await smartlingProjectApi.getProjectDetails(projectId);

            logger.debug(JSON.stringify(result));
        } catch (e) {
            logger.error(e);
        }
    })();
}
