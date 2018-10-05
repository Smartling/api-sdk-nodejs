const program = require("commander");
const SmartlingAuthApi = require("../api/auth");
const SmartlingProgressTrackerApi = require("../api/progress-tracker");
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
    const smartlingProgressTrackerApi = new SmartlingProgressTrackerApi(
        authApi,
        logger,
        "https://api.smartling.com"
    );

    (async () => {
        try {
            const projectId = "1295c174d";
            const spaceId = "spaceId";
            const objectId = "objectId";

            const createRecordResponse = await smartlingProgressTrackerApi
                .createRecord(projectId, spaceId, objectId, {
                    ttl: 3600,
                    data: {
                        property: "value"
                    }
                });

            await smartlingProgressTrackerApi
                .updateRecord(projectId, spaceId, objectId, createRecordResponse.recordId, {
                    ttl: 5,
                    data: {
                        property: "new_value"
                    }
                });

            await smartlingProgressTrackerApi
                .deleteRecord(projectId, spaceId, objectId, createRecordResponse.recordId);
        } catch (e) {
            logger.error(e);
        }
    })();
}
