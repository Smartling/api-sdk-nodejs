const program = require("commander");
const SmartlingAuthApi = require("../api/auth");
const SmartlingFileApi = require("../api/file");
const RetrievalTypes = require("../api/file/params/retrieval-types");
const DownloadFileParameters = require("../api/file/params/download-file-parameters");
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

        smartlingFileApi.setOptions({ timeout: 1000 });

        try {
            let result = await smartlingFileApi.getStatusForAllLocales(projectId, fileUri);
            logger.debug("-------- Get status for all locales ---------");
            logger.debug(JSON.stringify(result));

            result = await smartlingFileApi.getLastModified(projectId, fileUri);
            logger.debug("-------- Get last modified for all locales ---------");
            logger.debug(JSON.stringify(result));

            const downloadFileParams = new DownloadFileParameters();

            downloadFileParams.setRetrievalType(RetrievalTypes.pseudo);

            result = await smartlingFileApi.downloadFile(projectId, fileUri, "fr-FR", downloadFileParams);
            logger.debug("-------- Download file ---------");
            logger.debug(result);
        } catch (e) {
            logger.error(e);
        }
    })();
}
