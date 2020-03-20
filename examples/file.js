const SmartlingAuthApi = require("../api/auth");
const SmartlingFileApi = require("../api/file");
const RetrievalTypes = require("../api/file/params/retrieval-types");
const DownloadFileParameters = require("../api/file/params/download-file-parameters");

const logger = console;
const projectId = process.env.PROJECT_ID;
const userId = process.env.USER_ID;
const userSecret = process.env.USER_SECRET;

if (userId && userSecret) {
    const authApi = new SmartlingAuthApi(
        userId,
        userSecret,
        logger,
        "https://api.smartling.com"
    );
    const smartlingFileApi = new SmartlingFileApi(authApi, logger, "https://api.smartling.com");

    (async () => {
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
