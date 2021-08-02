const SmartlingFilesApi = require("../api/files");
const RetrievalTypes = require("../api/files/params/retrieval-types");
const DownloadFileParameters = require("../api/files/params/download-file-parameters");
// eslint-disable-next-line import/no-unresolved
const { SmartlingApiClientBuilder } = require("../api/builder");

const logger = console;
const projectId = process.env.PROJECT_ID;
const userId = process.env.USER_ID;
const userSecret = process.env.USER_SECRET;

if (userId && userSecret) {
    const baseUrl = "https://api.smartling.com";
    const smartlingFilesApi = new SmartlingApiClientBuilder()
        .setLogger(logger)
        .setBaseSmartlingApiUrl(baseUrl)
        .setClientLibMetadata("example-lib-name", "example-lib-version")
        .setHttpClientConfiguration({
            timeout: 10000
        })
        .authWithUserIdAndUserSecret(userId, userSecret)
        .build(SmartlingFilesApi);

    (async () => {
        const fileUri = "test";

        try {
            let result = await smartlingFilesApi.getStatusForAllLocales(projectId, fileUri);
            logger.debug("-------- Get status for all locales ---------");
            logger.debug(JSON.stringify(result));

            result = await smartlingFilesApi.getLastModified(projectId, fileUri);
            logger.debug("-------- Get last modified for all locales ---------");
            logger.debug(JSON.stringify(result));

            const downloadFileParams = new DownloadFileParameters();

            downloadFileParams.setRetrievalType(RetrievalTypes.pseudo);

            result = await smartlingFilesApi.downloadFile(projectId, fileUri, "fr-FR", downloadFileParams);
            logger.debug("-------- Download file ---------");
            logger.debug(result);

            await smartlingFilesApi.deleteFile(projectId, fileUri);
            logger.debug("-------- File deleted ---------");
        } catch (e) {
            logger.error(e);
        }
    })();
}
